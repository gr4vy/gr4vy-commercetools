// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants, getLogger } from "@gr4vy-ct/common"
import Logger from "bunyan";

import { OrderCaptureDetails, OrderRefundDetails, OrderVoidDetails } from "./../model"
import {
  captureOrder,
  refundOrder,
  voidOrder,
  addCaptureTransaction,
  updateCtOrder,
  addVoidTransaction,
  addRefundTransaction,
  updateCtRefundOrder,
  RefundMessageObject,
} from "./../service"
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
  const logger = getLogger()
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
  const gr4vyTransactionId = await captureOrder(orderCapture)
  if (!gr4vyTransactionId) {
    return {
      orderCaptureStatus: false,
      message: `Error during capture order from CT for order: ${orderId}`,
    }
  }

  const captureTransactionAdded = await addCaptureTransactionAtCt(
    orderCapture,
    gr4vyTransactionId,
    orderCaptureDetails,
    logger
  )
  if (!captureTransactionAdded) {
    return {
      orderCaptureStatus: true,
      gr4vyTransactionId: gr4vyTransactionId,
      captureTransactionAddedAtCt: false,
      message: `Error while adding capture transaction at CT for order: ${orderId}`,
    }
  }

  const orderStatusUpdatedAtCt = await updateOrderAtCt(orderCapture, orderCaptureDetails, logger)
  if (!orderStatusUpdatedAtCt) {
    return {
      orderCaptureStatus: true,
      gr4vyTransactionId: gr4vyTransactionId,
      captureTransactionAddedAtCt: true,
      orderStatusUpdatedAtCt: false,
      message: `Error while updating order at CT for order: ${orderId}`,
    }
  }

  return {
    orderCaptureStatus: true,
    gr4vyTransactionId: gr4vyTransactionId,
    captureTransactionAddedAtCt: true,
    orderStatusUpdatedAtCt: true,
    orderId: orderCapture.orderId,
  }
}

// eslint-disable-next-line
async function handleTransactionRefund(event: any) {
  const logger = getLogger()
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
  const gr4vyTransactionId = await refundOrder(orderRefund)

  if (!gr4vyTransactionId) {
    return {
      orderRefundStatus: false,
      message: `Error during order refund action from CT for order: ${orderId}`,
    }
  }

  const refundTransactionAdded = await addRefundTransactionAtCt(
    orderRefund,
    gr4vyTransactionId,
    orderRefundDetail,
    logger
  )
  if (!refundTransactionAdded) {
    return {
      orderRefundStatus: true,
      gr4vyTransactionId: gr4vyTransactionId,
      refundTransactionAddedAtCt: false,
      message: `Error while adding refund transaction at CT for order: ${orderId}`,
    }
  }

  const orderStatusUpdatedAtCt = await updateOrderRefundStatusAtCt(
    orderRefund,
    orderRefundDetail,
    orderRefundDetail.refundObject,
    logger
  )
  if (!orderStatusUpdatedAtCt) {
    return {
      orderRefundStatus: true,
      gr4vyTransactionId: gr4vyTransactionId,
      refundTransactionAddedAtCt: true,
      orderStatusUpdatedAtCt: false,
      message: `Error while updating order status at CT for order: ${orderId}`,
    }
  }

  return {
    orderRefundStatus: true,
    gr4vyTransactionId: gr4vyTransactionId,
    captureTransactionAddedAtCt: true,
    orderStatusUpdatedAtCt: true,
    orderId: orderRefund.orderId,
  }
}

// eslint-disable-next-line
async function handleTransactionVoid(event: any) {
  const logger = getLogger()
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
  const gr4vyTransactionId = await voidOrder(orderVoid)
  if (!gr4vyTransactionId) {
    return {
      orderVoidStatus: false,
      message: `Error during order void action from CT for order: ${orderId}`,
    }
  }

  const voidTransactionAdded = await addVoidTransactionAtCt(
    orderVoid,
    gr4vyTransactionId,
    orderVoidDetail,
    logger
  )
  if (!voidTransactionAdded) {
    return {
      orderVoidStatus: false,
      gr4vyTransactionId: gr4vyTransactionId,
      voidTransactionAddedAtCt: false,
      message: `Error while adding void transaction at CT for order: ${orderId}`,
    }
  }

  return {
    orderVoidStatus: true,
    gr4vyTransactionId: gr4vyTransactionId,
    voidTransactionAddedAtCt: true,
  }
}

async function addCaptureTransactionAtCt(
  orderCapture: CaptureOrderDetailsInterface,
  gr4vyTransactionId: string,
  orderCaptureDetails: OrderCaptureDetails,
  // eslint-disable-next-line
  logger: Logger
): Promise<any> {
  const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
  let iteration = 0
  while (iteration < maxIteration) {
    iteration++
    logger.debug(`Retry iteration: ${iteration}`)
    const { hasErrDueConcurrentModification, captureTransactionAdded } =
      await addCaptureTransaction(orderCapture, gr4vyTransactionId)

    if (!hasErrDueConcurrentModification) {
      return captureTransactionAdded
    } else {
      const orderCapture: CaptureOrderDetailsInterface = await orderCaptureDetails.execute()
      return await addCaptureTransactionAtCt(orderCapture, gr4vyTransactionId, orderCaptureDetails, logger)
    }
  }

  if (iteration === maxIteration) {
    throw {
      message: `Maximum retry failed!. Unable to add capture transaction at CT payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}, order ID ${orderCapture.orderId}`,
      statusCode: 409,
    }
  }
}

async function addRefundTransactionAtCt(
  orderRefund: OrderRefundDetailsInterface,
  gr4vyTransactionId: string,
  orderRefundDetails: OrderRefundDetails,
  logger:Logger
  // eslint-disable-next-line
): Promise<any> {
  const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
  let iteration = 0
  while (iteration < maxIteration) {
    iteration++
    logger.debug(`Retry iteration: ${iteration}`)
    const { hasErrDueConcurrentModification, refundTransactionAdded } = await addRefundTransaction(
      orderRefund,
      gr4vyTransactionId
    )

    if (!hasErrDueConcurrentModification) {
      return refundTransactionAdded
    } else {
      const orderRefund: OrderRefundDetailsInterface = await orderRefundDetails.execute()
      return await addRefundTransactionAtCt(orderRefund, gr4vyTransactionId, orderRefundDetails, logger)
    }
  }

  if (iteration === maxIteration) {
    throw {
      message: `Maximum retry failed!. Unable to add refund transaction at CT payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}, order ID ${orderRefund.orderId}`,
      statusCode: 409,
    }
  }
}

async function addVoidTransactionAtCt(
  orderVoid: OrderVoidDetailsInterface,
  gr4vyTransactionId: string,
  orderVoidDetails: OrderVoidDetails,
  logger:Logger
  // eslint-disable-next-line
): Promise<any> {
  const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
  let iteration = 0
  while (iteration < maxIteration) {
    iteration++
    logger.debug(`Retry iteration: ${iteration}`)
    const { hasErrDueConcurrentModification, voidTransactionAdded } = await addVoidTransaction(
      orderVoid,
      gr4vyTransactionId
    )

    if (!hasErrDueConcurrentModification) {
      return voidTransactionAdded
    } else {
      const orderVoid: OrderVoidDetailsInterface = await orderVoidDetails.execute()
      return await addVoidTransactionAtCt(orderVoid, gr4vyTransactionId, orderVoidDetails, logger)
    }
  }

  if (iteration === maxIteration) {
    throw {
      message: `Maximum retry failed!. Unable to add capture transaction at CT payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}`,
      statusCode: 409,
    }
  }
}

async function updateOrderAtCt(
  orderCapture: CaptureOrderDetailsInterface,
  orderCaptureDetails: OrderCaptureDetails,
  logger: Logger
  // eslint-disable-next-line
): Promise<any> {
  const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
  let iteration = 0
  while (iteration < maxIteration) {
    iteration++
    logger.debug(`Retry iteration: ${iteration}`)
    const { hasErrDueConcurrentModification, orderUpdated } = await updateCtOrder(orderCapture)

    if (!hasErrDueConcurrentModification) {
      return orderUpdated
    } else {
      const orderCapture: CaptureOrderDetailsInterface = await orderCaptureDetails.execute()
      return await updateOrderAtCt(orderCapture, orderCaptureDetails, logger)
    }
  }

  if (iteration === maxIteration) {
    throw {
      message: `Maximum retry failed!. Unable to update order status at CT due to concurrency issue for order ID ${orderCapture.orderId}`,
      statusCode: 409,
    }
  }
}

async function updateOrderRefundStatusAtCt(
  orderRefund: OrderRefundDetailsInterface,
  orderRefundDetails: OrderRefundDetails,
  refundData: RefundMessageObject,
  logger: Logger
  // eslint-disable-next-line
): Promise<any> {
  const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2
  let iteration = 0
  while (iteration < maxIteration) {
    iteration++
    logger.debug(`Retry iteration: ${iteration}`)
    const { hasErrDueConcurrentModification, orderUpdated } = await updateCtRefundOrder(
      orderRefund,
      refundData
    )

    if (!hasErrDueConcurrentModification) {
      return orderUpdated
    } else {
      const orderRefund: OrderRefundDetailsInterface = await orderRefundDetails.execute()
      return await updateOrderRefundStatusAtCt(orderRefund, orderRefundDetails, refundData, logger)
    }
  }

  if (iteration === maxIteration) {
    throw {
      message: `Maximum retry failed!. Unable to update order refund status at CT due to concurrency issue for order ID ${orderRefund.orderId}`,
      statusCode: 409,
    }
  }
}
export { handleTransactionCapture, handleTransactionRefund, handleTransactionVoid }
