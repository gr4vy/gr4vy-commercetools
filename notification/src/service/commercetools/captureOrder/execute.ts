import {
  getCustomObjects,
  Constants,
  getTransactionById,
  getOrderById,
  addTransaction,
  updateTransaction,
} from "@gr4vy-ct/common"
import { Transaction } from "@gr4vy-ct/common/src/services/types"

import { transactionCapture, updateOrder } from "./../../../service"
import { OrderUpdate } from "../../types"
import { CaptureOrderDetailsInterface } from "./../../../model/order/interfaces"

const {
  STATES: { GR4VY, CT },
} = Constants

const captureOrder = async (captureOrderDetails: CaptureOrderDetailsInterface) => {
  if (captureOrderDetails.totalAmount <= 0) {
    throw new Error("There is an error - Total amount to capture is invalid or zero")
  }

  const gr4vyTransactionId = captureOrderDetails.paymentTransactionId
  const capture = { amount: captureOrderDetails.totalAmount, transactionId: gr4vyTransactionId }
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

  if (gr4vyTransactionStatus == GR4VY.TRANSACTION.CAPTURE_SUCCEEDED) {
    throw {
      message: `The transaction ${gr4vyTransactionId} was already captured`,
      statusCode: 400,
    }
  }

  const { body: transactionCaptureResponse } = await transactionCapture({ capture, paymentConfig })
  if (
    transactionCaptureResponse &&
    transactionCaptureResponse.status == GR4VY.TRANSACTION.CAPTURE_SUCCEEDED
  ) {
    const { id: gr4vyCaptureTransactionId } = transactionCaptureResponse
    return gr4vyCaptureTransactionId
  }
  return false
}

const addCaptureTransaction = async (
  captureOrderDetails: CaptureOrderDetailsInterface,
  gr4vyCaptureTransactionId: string
) => {
  const order = await getOrderById(captureOrderDetails.orderId)
  if (!order) {
    throw {
      message: `Error during fetching order from CT for orderId: ${captureOrderDetails.orderId}`,
      statusCode: 400,
    }
  }
  const [payment] = order?.paymentInfo?.payments || []

  const chargeTransactionExists = payment?.transactions.find(
    (transaction: Transaction) => transaction.type === CT.TRANSACTION.TYPES.CHARGE
  )
  let transactionResponse
  if (!chargeTransactionExists) {
    transactionResponse = await addTransaction({
      isRefund: false,
      order,
      status: CT.TRANSACTION.SUCCESS,
      paymentVersion: captureOrderDetails.paymentVersion,
      transactionType: CT.TRANSACTION.TYPES.CHARGE,
      amount: captureOrderDetails.totalAmount,
      currency: captureOrderDetails.currencyCode,
      customValue: gr4vyCaptureTransactionId,
    })
  } else {
    if (chargeTransactionExists.state !== CT.TRANSACTION.SUCCESS) {
      transactionResponse = await updateTransaction({
        payment,
        paymentVersion: captureOrderDetails.paymentVersion,
        transaction: chargeTransactionExists,
        transactionState: CT.TRANSACTION.SUCCESS,
      })
    } else {
      transactionResponse = {
        hasErrDueConcurrentModification: false,
        captureTransactionAdded: true,
      }
    }
  }
  const { hasErrDueConcurrentModification, version: captureTransactionAdded } = transactionResponse

  return { hasErrDueConcurrentModification, captureTransactionAdded }
}

const updateCtOrder = async (captureOrderDetails: CaptureOrderDetailsInterface) => {
  const orderUpdate: OrderUpdate = {
    orderId: captureOrderDetails.orderId,
    version: captureOrderDetails.version,
    orderState: CT.ORDER.CONFIRMED,
    paymentState: CT.ORDERPAYMENT.PAID,
  }
  const { hasErrDueConcurrentModification, version: orderUpdated } = await updateOrder({
    orderUpdate,
  })
  return { hasErrDueConcurrentModification, orderUpdated }
}

export { captureOrder, addCaptureTransaction, updateCtOrder }
