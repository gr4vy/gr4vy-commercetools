import { Order } from "@commercetools/platform-sdk"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrder, prepareCTStatuses, updateOrderWithPayment, Constants, getOrderById, listTransactionRefunds, addTransaction, updateTransaction } from "@gr4vy-ct/common"
import Logger from "bunyan"

import { sleep } from "../utils/retry"

const handleUpdatePayment = async ({ request, gr4vyTransactionResult, meClient }: any) => {
  // Fetch order id from the transaction
  const gr4vyTransaction = gr4vyTransactionResult?.body || {}
  const {
    externalIdentifier: orderId,
    status,
    amount: gr4vyTransactionAmount,
    capturedAmount: gr4vyCapturedAmount,
    refundedAmount: gr4vyRefundedAmount,
  } = gr4vyTransaction

  // Get order payment and transaction details
  const order = meClient ? await getOrder({ request, orderId }) : await getOrderById(orderId)

  if (!order) {
    throw {
      message: `Error in fetching CT order`,
      statusCode: 400,
    }
  }

  const [payment] = order?.paymentInfo?.payments || []

  if (!payment) {
    throw {
      message: `Error in fetching payment for order ID ${orderId}`,
      statusCode: 400,
    }
  }

  const [transaction] = payment?.transactions || []

  if (!transaction) {
    throw {
      message: `Error in fetching transaction for order payment ID ${payment?.id}`,
      statusCode: 400,
    }
  }

  const ctTransactionAmount = order?.taxedPrice?.totalGross?.centAmount
  const ctTransactionType = transaction?.type
  const ctTransactionId = transaction?.id

  // Double check if the amount are equal
  if (gr4vyTransactionAmount !== ctTransactionAmount) {
    throw {
      message: `Error in mismatch amounts for gr4vy and CT for order payment ID ${payment?.id}`,
      statusCode: 400,
    }
  }

  const { orderState, orderPaymentState, transactionState } = prepareCTStatuses(
    status,
    ctTransactionType,
    ctTransactionId,
    gr4vyCapturedAmount,
    gr4vyRefundedAmount
  )

  // Create custom field in CT for order to save Gr4vy transaction id
  // Update payment info in CT based on Gr4vy transaction
  const { hasOrderWithPaymentUpdated, hasErrDueConcurrentModification } =
    await updateOrderWithPayment({
      order,
      orderState,
      orderPaymentState,
      transactionState,
      gr4vyTransaction,
    })

  const responseData = {
    orderId: order.id,
    isUpdated: !!hasOrderWithPaymentUpdated,
    hasErrDueConcurrentModification,
    gr4vyTransaction,
  }

  return responseData
}

const handleTransactions = async (logger: Logger, orderId: Order, gr4vyTransaction: any) => {
  // Get latest order payment and transaction details
  const order = await getOrderById(orderId)

  const [payment] = order?.paymentInfo?.payments || []

  if (!payment) {
    throw {
      message: `Error in fetching payment for order ID ${orderId}`,
      statusCode: 400,
    }
  }

  let paymentVersion = payment.version
  const ctTransactions = payment?.transactions || []
  const {
    id: gr4vyTransactionId,
    status,
    intent,
    amount,
    capturedAmount,
    refundedAmount,
  } = gr4vyTransaction

  const transactionMapper: any = {
    Authorization: "authorize",
    Refund: "capture",
    Charge: "capture",
  }

  const existingCTTransactionTypes = ctTransactions.map(
    (t: { type: string }) => transactionMapper[t.type]
  )

  for (const transaction of ctTransactions) {
    
    if (transactionMapper[transaction.type] === intent) {
      const { transactionState } = await prepareCTStatuses(
        status,
        transaction.type,
        transaction.id,
        capturedAmount,
        refundedAmount
      )
      
      if (transactionState !== transaction.state) {
        let iteration = 0
        const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
        const retryInterval = Number(process.env.PAYMENT_UPDATE_RETRY_INTERVAL) || 1000

        while (iteration < maxIteration) {
          iteration++
          logger.debug(`handleTransactions:updateTransaction:retry iteration: ${iteration}`)
          const { version, hasErrDueConcurrentModification } = await updateTransaction({
            payment,
            paymentVersion,
            transaction,
            transactionState,
          })
          if (!hasErrDueConcurrentModification) {
            paymentVersion = version
            break;
          }
          await sleep(retryInterval)
        }

        if (iteration === maxIteration) {
          throw {
            message: `Maximum retry failed!. [handleTransactions:updateTransaction] Unable to update payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}`,
            statusCode: 409,
          }
        }
      }
    } else {
      if (!existingCTTransactionTypes.includes(intent)) {
        const { version } = await addTransaction({
          isRefund: false,
          order,
          status,
          paymentVersion,
          transactionType: transaction.type === "authorize" ? "Authorization" : "Charge",
          amount: amount,
          currency: transaction?.amount.currencyCode,
          customValue: gr4vyTransactionId,
        })
        paymentVersion = version
      }
    }
  }

  if (refundedAmount > 0) {
    await createRefundTransactions({
      order,
      paymentVersion,
      payment,
      gr4vyTransactionId,
    })
  }
}

const createRefundTransactions = async ({
  order,
  paymentVersion,
  payment,
  gr4vyTransactionId,
}: {
  order: Order
  paymentVersion: number
  payment: { transactions: any }
  gr4vyTransactionId: string
}) => {
  const { items } = await listTransactionRefunds(gr4vyTransactionId)
  if (!items) {
    throw {
      message: `Error in fetching gr4vy refund transaction for ID ${gr4vyTransactionId}`,
      statusCode: 400,
    }
  }

  const ctTransactions = payment?.transactions

  const ctCustomRefundIds: string[] = []

  for (const transaction of ctTransactions) {
    if (transaction?.custom) {
      const {
        custom: { customFieldsRaw },
      } = transaction

      if (customFieldsRaw && Array.isArray(customFieldsRaw)) {
        customFieldsRaw.forEach(customField => {
          if (customField.name === Constants.CT_CUSTOM_FIELD_TRANSACTION_REFUND) {
            ctCustomRefundIds.push(customField.value)
          }
        })
      }
    }
  }

  for (const refundItem of items) {
    if (!ctCustomRefundIds.includes(refundItem.id)) {
      const { status, currency, amount } = refundItem
      const { version } = await addTransaction({
        isRefund: true,
        order,
        status,
        paymentVersion,
        transactionType: "Refund",
        amount,
        currency,
        customValue: refundItem.id,
      })
      paymentVersion = version
    }
  }
}

export { handleUpdatePayment, handleTransactions, createRefundTransactions }
