// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getCustomObjects, Constants, addTransaction, getOrderById,} from "@gr4vy-ct/common"

import { transactionRefund, updateRefundOrder } from "./../../../service"
import { OrderUpdateForRefund, RefundMessageObject } from "../../types"
import {
  OrderRefundDetailsInterface,
} from "./../../../model/order/interfaces"

const {
  STATES: { GR4VY },
} = Constants

const refundOrder = async (orderRefundDetails: OrderRefundDetailsInterface): Promise<string> => {
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
    const { id: gr4vyRefundTransactionId } = transactionRefundResponse
    return gr4vyRefundTransactionId
  }
  return ""
}

const addRefundTransaction = async (
  orderRefundDetails: OrderRefundDetailsInterface,
  gr4vyRefundTransactionId: string
) => {
  const order = await getOrderById(orderRefundDetails.orderId)
  if (!order) {
    throw {
      message: `Error during fetching order from CT for orderId: ${orderRefundDetails.orderId}`,
      statusCode: 400,
    }
  }
  const [payment] = order?.paymentInfo?.payments || []

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
  if (ctCustomRefundIds.includes(gr4vyRefundTransactionId)) {
    return { hasErrDueConcurrentModification: false, refundTransactionAdded: true }
  } else {
    const { hasErrDueConcurrentModification, version: refundTransactionAdded } =
      await addTransaction({
        isRefund: true,
        order,
        status: GR4VY.TRANSACTION.REFUND_SUCCEEDED,
        paymentVersion: orderRefundDetails.paymentVersion,
        transactionType: "Refund",
        amount: orderRefundDetails.refundAmount,
        currency: orderRefundDetails.currencyCode,
        customValue: gr4vyRefundTransactionId,
      })
    return { hasErrDueConcurrentModification, refundTransactionAdded }
  }
}

const updateCtRefundOrder = async (
  orderRefundDetails: OrderRefundDetailsInterface,
  refundData: RefundMessageObject
) => {
  const orderUpdateForRefund: OrderUpdateForRefund = {
    orderId: orderRefundDetails.orderId,
    version: orderRefundDetails.version,
  }
  const { hasErrDueConcurrentModification, version: orderUpdated } = await updateRefundOrder(
    { orderUpdateForRefund },
    { refundData }
  )
  return { hasErrDueConcurrentModification, orderUpdated }
}

export { refundOrder, addRefundTransaction, updateCtRefundOrder }
