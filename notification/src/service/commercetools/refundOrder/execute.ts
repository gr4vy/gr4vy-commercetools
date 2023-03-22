// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, ApiClient, Constants } from "@gr4vy-ct/common"

import { transactionRefund, updateRefundOrder } from "./../../../service"
import { OrderUpdateForRefund, RefundMessageObject } from "../../types"
import { addTransactionRefund } from "./query"
import { responseMapper } from "./mapper"
import { OrderRefundDetailsInterface } from "../getOrderDetails/interfaces"

const refundOrder = async (
  orderRefundDetails: OrderRefundDetailsInterface,
  refundData: RefundMessageObject
): Promise<boolean> => {
  if (orderRefundDetails.refundAmount <= 0) {
    throw new Error("There is an error - Total amount to refund is invalid or zero")
  }
  const refund = {
    amount: orderRefundDetails.refundAmount,
    transactionId: orderRefundDetails.paymentTransactionId,
  }
  const paymentConfig = await getCustomObjects()
  const { body: transactionRefundResponse } = await transactionRefund({ refund, paymentConfig })

  const {
    STATES: { GR4VY },
  } = Constants

  if (
    transactionRefundResponse &&
    transactionRefundResponse.status == GR4VY.TRANSACTION.REFUND_SUCCEEDED
  ) {
    const { createdAt: transactionDate } = transactionRefundResponse
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: addTransactionRefund,
      variables: {
        version: orderRefundDetails.paymentVersion,
        paymentId: orderRefundDetails.paymentId,
        amount: orderRefundDetails.refundAmount,
        currencyCode: orderRefundDetails.currencyCode,
        transactionId: orderRefundDetails.paymentTransactionId,
        timeStamp: transactionDate,
      },
    })
    const orderRefunded = await responseMapper(await apiClient.getData())
    if (orderRefunded) {
      const orderUpdateForRefund: OrderUpdateForRefund = {
        orderId: orderRefundDetails.orderId,
        version: orderRefundDetails.version,
      }
      return await updateRefundOrder({ orderUpdateForRefund }, { refundData })
    }
  }
  return false
}
export { refundOrder }
