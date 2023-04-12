import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger, Constants, getTransactionById, getOrderById, updateOrderWithPayment, prepareCTStatuses, listTransactionRefunds, addTransaction, Order, updateTransaction } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()

  // Log the request
  logger.debug({
    method: request.method,
    url: request.url,
    headers: request.headers,
  })
  
  if (!isPostRequest(request)) {
    logger.debug(`Received non-POST request: ${request.method}. The request will not be processed!`)
    return ResponseHelper.setResponseError(response, {
      httpStatusCode: StatusCodes.BAD_REQUEST,
      errors: [
        {
          code: StatusCodes.BAD_REQUEST,
          message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        },
      ],
    })
  }

  try {
    logger.debug("request body", request.body)

    const { type: webhookEventType, target } = request.body

    if (!webhookEventType || (webhookEventType && webhookEventType !== "event")) {
      throw {
        message: `A Webhook request was received with an invalid entity type - ${webhookEventType}`,
        statusCode: 422,
      }
    }

    const gr4vyTransactionId = target?.transaction_id

    if (!gr4vyTransactionId) {
      throw {
        message: `Required parameter gr4vyTransactionId is missing or empty`,
        statusCode: 400,
      }
    }

    // Get gr4vy transaction by ID
    const gr4vyTransactionResult = await getTransactionById(gr4vyTransactionId)

    if (!gr4vyTransactionResult) {
      throw {
        message: `Error in fetching gr4vy transaction for ID ${gr4vyTransactionId}`,
        statusCode: 400,
      }
    }

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
    const order = await getOrderById(orderId)

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

    // Preparing order and payment statuses to update
    const { orderState, orderPaymentState, transactionState } = await prepareCTStatuses(
      status,
      ctTransactionType,
      ctTransactionId,
      gr4vyCapturedAmount,
      gr4vyRefundedAmount
    )

    // Create custom field in CT for order to save Gr4vy transaction id
    // Update payment info in CT based on Gr4vy transaction
    const { hasOrderWithPaymentUpdated } = await updateOrderWithPayment({
      order,
      orderState,
      orderPaymentState,
      transactionState,
      gr4vyTransaction,
    })

    await handleTransactions(orderId, gr4vyTransaction)

    const responseData = {
      order: order.id,
      isUpdated: hasOrderWithPaymentUpdated,
    }

    ResponseHelper.setResponseTo200(response, responseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing update payment request: Ending the process. ` +
      `Error: ${JSON.stringify(e)}`
    logger.debug(errorStackTrace)

    ResponseHelper.setResponseError(response, {
      httpStatusCode: e.statusCode || 500,
      errors: [
        {
          code: e.statusCode || 500,
          message: e?.response?.body?.message || e.message,
        },
      ],
    })
  }
}

const handleTransactions = async (orderId: Order, gr4vyTransaction: any) => {
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
  const { id: gr4vyTransactionId, status, intent, amount, capturedAmount, refundedAmount } = gr4vyTransaction
  
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
        const { version } = await updateTransaction({
          payment,
          paymentVersion,
          transaction,
          transactionState,
        })
        paymentVersion = version
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

  if(refundedAmount > 0){
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

  for(const refundItem of items){
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

export default { processRequest }
