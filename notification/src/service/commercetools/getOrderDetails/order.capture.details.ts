// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrderById } from "@gr4vy-ct/common"

import { OrderDetailsInterface } from "./interfaces"
import {OrderDetails} from "./order.details";

class OrderCaptureDetails extends OrderDetails implements OrderDetailsInterface {
  totalAmount: number

  async execute() {
    const orderId = this.orderId

    // Fetch order details from Commercetools
    const order = await getOrderById(orderId)

    if (!order) {
      return
    }
    const { version, totalPrice, paymentInfo } = order

    const [payment] = paymentInfo?.payments || []

    if (!payment?.id) {
      return
    }

    return {
      orderId,
      currencyCode: totalPrice.currencyCode,
      totalAmount: totalPrice.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: this.getTransactionId(order)
    }
  }
}

export { OrderCaptureDetails }
