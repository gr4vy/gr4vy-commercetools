// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants } from "@gr4vy-ct/common"

import { OrderCaptureDetails, OrderRefundDetails, OrderVoidDetails } from "./../model"
import { captureOrder, refundOrder, voidOrder } from "./../service"
import {
  CaptureOrderDetailsInterface,
  OrderRefundDetailsInterface,
  OrderVoidDetailsInterface,
} from "../model/order/interfaces"

const {
  STATES: { CT },
} = Constants

// eslint-disable-next-line
async function handleTransactionCapture(event: any) {
  const orderCaptureDetails: OrderCaptureDetails = new OrderCaptureDetails(event)

  //Load order details from Commercetools
  const orderCapture: CaptureOrderDetailsInterface = await orderCaptureDetails.execute()
  if (!orderCapture) {
    return {
      orderCaptureStatus: false,
      message: `Error during fetching order details from CT`,
    }
  }
  const { orderId } = orderCapture
  const captureStatus = await captureOrder(orderCapture)
  if (!captureStatus) {
    return {
      orderCaptureStatus: false,
      message: `Error during capture order from CT for order: ${orderId}`,
    }
  }

  return {
    orderCaptureStatus: captureStatus,
    orderId: orderCapture.orderId,
  }
}

// eslint-disable-next-line
async function handleTransactionRefund(event: any) {
  const orderRefundDetail: OrderRefundDetails = new OrderRefundDetails(event)

  //Load order details from Commercetools
  const orderRefund: OrderRefundDetailsInterface = await orderRefundDetail.execute()
  if (!orderRefund) {
    return {
      orderRefundStatus: false,
      message: `Error during fetching order details from CT`,
    }
  }
  const { orderId } = orderRefund
  const refundStatus = await refundOrder(orderRefund, orderRefundDetail.refundObject)
  if (!refundStatus) {
    return {
      orderRefundStatus: false,
      message: `Error during changing order refund details from CT for order: ${orderId}`,
    }
  }

  return {
    orderRefundStatus: refundStatus,
    refundDetails: orderRefund,
    orderId: orderRefund.orderId,
  }
}

// eslint-disable-next-line
async function handleTransactionVoid(event: any) {
  const orderVoidDetail: OrderVoidDetails = new OrderVoidDetails(event)
  //Load order details from Commercetools
  const orderVoid: OrderVoidDetailsInterface = await orderVoidDetail.execute()
  if (!orderVoid) {
    return {
      orderVoidStatus: false,
      message: `Error during fetching order details from CT`,
    }
  }

  const orderState = orderVoid.orderState
  if (orderState != CT.ORDER.CANCELLED) {
    return {
      orderVoidStatus: false,
      message: `Order should be in Cancelled state to process void transaction. Current status is ${orderState}`,
    }
  }
  const { orderId } = orderVoidDetail
  const voidStatus = await voidOrder(orderVoid)
  if (!voidStatus) {
    return {
      orderVoidStatus: false,
      message: `Error during changing order void details from CT for order: ${orderId}`,
    }
  }

  return {
    orderVoidStatus: voidStatus,
    orderId: orderVoid.orderId,
  }
}

export { handleTransactionCapture, handleTransactionRefund, handleTransactionVoid }
