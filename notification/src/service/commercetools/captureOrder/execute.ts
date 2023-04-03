// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, ApiClient, Constants, getTransactionById } from "@gr4vy-ct/common"

import { transactionCapture, updateOrder } from "./../../../service"
import { OrderUpdate } from "../../types"
import { addTransactionCapture } from "./query"
import { responseMapper } from "./mapper"
import { CaptureOrderDetailsInterface } from "./../../../model/order/interfaces"

const captureOrder = async (captureOrderDetails: CaptureOrderDetailsInterface) => {
  if (captureOrderDetails.totalAmount <= 0) {
    throw new Error("There is an error - Total amount to capture is invalid or zero")
  }
  const {
    STATES: { GR4VY, CT },
  } = Constants

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
    const { createdAt: transactionDate } = transactionCaptureResponse
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: addTransactionCapture,
      variables: {
        version: captureOrderDetails.paymentVersion,
        paymentId: captureOrderDetails.paymentId,
        amount: captureOrderDetails.totalAmount,
        currencyCode: captureOrderDetails.currencyCode,
        transactionId: captureOrderDetails.paymentTransactionId,
        timeStamp: transactionDate,
      },
    })
    const orderCaptureTransactionAdded = await responseMapper(await apiClient.getData())
    if (orderCaptureTransactionAdded) {
      const orderUpdate: OrderUpdate = {
        orderId: captureOrderDetails.orderId,
        version: captureOrderDetails.version,
        orderState: CT.ORDER.CONFIRMED,
        paymentState: CT.ORDERPAYMENT.PAID,
      }
      return await updateOrder({ orderUpdate })
    }
  }
  return false
}
export { captureOrder }
