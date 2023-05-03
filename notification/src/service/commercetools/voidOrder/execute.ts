import {
  getCustomObjects,
  Constants,
  getTransactionById,
  getOrderById,
  addTransaction,
  updateTransaction,
  resolveOrderPayment,
} from "@gr4vy-ct/common"
import { Transaction } from "@gr4vy-ct/common/src/services/types"

import { transactionVoid } from "./../../../service"
import { OrderVoidDetailsInterface } from "./../../../model/order/interfaces"

const {
  STATES: { GR4VY, CT },
} = Constants

const voidOrder = async (orderVoidDetails: OrderVoidDetailsInterface) => {
  const gr4vyTransactionId = orderVoidDetails.paymentTransactionId || ""
  const voidTxion = { transactionId: gr4vyTransactionId }
  const paymentConfig = await getCustomObjects()

  // Get gr4vy transaction by ID
  const gr4vyTransaction = await getTransactionById(gr4vyTransactionId)

  if (!gr4vyTransaction) {
    throw {
      message: `Error in fetching gr4vy transaction for ID ${gr4vyTransactionId}`,
      statusCode: 400,
    }
  }

  const gr4vyTransactionStatus = gr4vyTransaction?.body?.status

  if (gr4vyTransactionStatus !== GR4VY.TRANSACTION.AUTHORIZATION_SUCCEEDED) {
    throw {
      message: `The transaction ${gr4vyTransactionId} is not voidable. Current status - ${gr4vyTransactionStatus}`,
      statusCode: 400,
    }
  }

  const { body: transactionVoidResponse } = await transactionVoid({ voidTxion, paymentConfig })

  if (
    transactionVoidResponse &&
    (transactionVoidResponse.status as unknown as string) == GR4VY.TRANSACTION.AUTHORIZATION_VOIDED
  ) {
    const { id: gr4vyVoidTransactionId } = transactionVoidResponse
    return gr4vyVoidTransactionId
  }
  return ""
}

const addVoidTransaction = async (
  orderVoidDetails: OrderVoidDetailsInterface,
  gr4vyVoidTransactionId: string
) => {
  const order = await getOrderById(orderVoidDetails.orderId)
  if (!order) {
    throw {
      message: `Error during fetching order from CT for orderId: ${orderVoidDetails.orderId}`,
      statusCode: 400,
    }
  }

  const payment = resolveOrderPayment(order)

  const voidTransactionExists = payment?.transactions.find(
    (transaction: Transaction) => transaction.type === CT.TRANSACTION.TYPES.CANCEL_AUTHORIZATION
  )
  let transactionResponse
  if (!voidTransactionExists) {
    transactionResponse = await addTransaction({
      isRefund: false,
      order,
      status: CT.TRANSACTION.SUCCESS,
      paymentVersion: orderVoidDetails.paymentVersion,
      transactionType: CT.TRANSACTION.TYPES.CANCEL_AUTHORIZATION,
      amount: orderVoidDetails.voidAmount || 0,
      currency: orderVoidDetails.currencyCode || "",
      customValue: gr4vyVoidTransactionId,
    })
  } else {
    if (voidTransactionExists.state !== CT.TRANSACTION.SUCCESS) {
      transactionResponse = await updateTransaction({
        payment,
        paymentVersion: orderVoidDetails.paymentVersion,
        transaction: voidTransactionExists,
        transactionState: CT.TRANSACTION.SUCCESS,
      })
    } else {
      transactionResponse = {
        hasErrDueConcurrentModification: false,
        captureTransactionAdded: true,
      }
    }
  }

  const { hasErrDueConcurrentModification, version: voidTransactionAdded } =
    transactionResponse as {
      hasErrDueConcurrentModification: boolean
      version: boolean
      captureTransactionAdded: boolean
    }

  return { hasErrDueConcurrentModification, voidTransactionAdded }
}

export { voidOrder, addVoidTransaction }
