// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, ApiClient, Constants, getTransactionById } from "@gr4vy-ct/common"

import { transactionCapture, updateOrder } from "./../../../service"
import { OrderUpdate } from "../../types"
import { addTransactionCapture } from "./query"
import { responseMapper } from "./mapper"
import { OrderDetailsInterface } from "./../getOrderDetails/interfaces"

const captureOrder = async (orderDetails: OrderDetailsInterface) => {
  if (orderDetails.totalAmount <= 0) {
    throw new Error("There is an error - Total amount to capture is invalid or zero")
  }
  const {
    STATES: { GR4VY, CT },
  } = Constants

  const gr4vyTransactionId = orderDetails.paymentTransactionId
  const capture = { amount: orderDetails.totalAmount, transactionId: gr4vyTransactionId }
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
        version: orderDetails.paymentVersion,
        paymentId: orderDetails.paymentId,
        amount: orderDetails.totalAmount,
        currencyCode: orderDetails.currencyCode,
        transactionId: orderDetails.paymentTransactionId,
        timeStamp: transactionDate,
      },
    })
    const orderCaptureTransactionAdded = await responseMapper(await apiClient.getData())
    if (orderCaptureTransactionAdded) {
      const orderUpdate: OrderUpdate = {
        orderId: orderDetails.orderId,
        version: orderDetails.version,
        orderState: CT.ORDER.CONFIRMED,
        paymentState: CT.ORDERPAYMENT.PAID,
      }
      return await updateOrder({ orderUpdate })
    }
  }
  return false
}
export { captureOrder }
