// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrderById } from "@gr4vy-ct/common"

import { OrderVoidDetailsInterface } from "./interfaces"
import { OrderDetails } from "./order.details"

export class OrderVoidDetails extends OrderDetails implements OrderVoidDetailsInterface {
  voidAmount: number

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
      voidAmount: totalPrice.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: this.getTransactionId(order),
    }
  }
}
