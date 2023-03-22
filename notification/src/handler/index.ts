// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants } from "@gr4vy-ct/common"

import {
  OrderCaptureDetails,
  captureOrder,
  OrderRefundDetails,
  RefundMessageObject,
  refundOrder,
  OrderVoidDetails,
  voidOrder,
} from "./../service"

const {
  STATES: { CT },
} = Constants

async function handleTransactionCapture(body: { orderId: string }) {
  const { orderId } = body
  const orderDetail: OrderCaptureDetails = new OrderCaptureDetails(orderId)

  //Load order details from Commercetools
  const order = await orderDetail.execute()
  if (!order) {
    return {
      orderCaptureStatus: false,
      message: `Error during fetching order details from CT for order: ${orderId}`,
    }
  }

  const captureStatus = await captureOrder(order)
  if (!captureStatus) {
    return {
      orderCaptureStatus: false,
      message: `Error during changing capture order from CT for order: ${orderId}`,
    }
  }

  return {
    orderCaptureStatus: captureStatus,
    orderId: order.orderId,
  }
}

async function handleTransactionRefund(body: { orderId: string; returnInfo: RefundMessageObject }) {
  const { orderId, returnInfo } = body
  const orderRefundDetail: OrderRefundDetails = new OrderRefundDetails(orderId, returnInfo)

  //Load order details from Commercetools
  const order = await orderRefundDetail.execute()
  if (!order) {
    return {
      orderRefundStatus: false,
      message: `Error during fetching order details from CT for order: ${orderId}`,
    }
  }

  const refundStatus = await refundOrder(order, returnInfo)
  if (!refundStatus) {
    return {
      orderRefundStatus: false,
      message: `Error during changing order refund details from CT for order: ${orderId}`,
    }
  }

  return {
    orderRefundStatus: refundStatus,
    refundDetails: order,
    orderId: order.orderId,
  }
}

async function handleTransactionVoid(body: {
  orderId: string
  orderState: string
  oldOrderState: string
}) {
  const orderState = body?.orderState

  if (orderState != CT.ORDER.CANCELLED) {
    return {
      orderVoidStatus: false,
      message: `Order should be in Cancelled state to process void transaction. Current status is ${orderState}`,
    }
  }

  const { orderId } = body
  const orderVoidDetail: OrderVoidDetails = new OrderVoidDetails(orderId)

  //Load order details from Commercetools
  const order = await orderVoidDetail.execute()
  if (!order) {
    return {
      orderVoidStatus: false,
      message: `Error during fetching order details from CT for order: ${orderId}`,
    }
  }

  const voidStatus = await voidOrder(order)
  if (!voidStatus) {
    return {
      orderVoidStatus: false,
      message: `Error during changing order void details from CT for order: ${orderId}`,
    }
  }

  return {
    orderVoidStatus: voidStatus,
    orderId: order.orderId,
  }
}

export { handleTransactionCapture, handleTransactionRefund, handleTransactionVoid }
