// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { resolveOrderPayment } from "@gr4vy-ct/common"

import { OrderVoidDetailsInterface } from "../interfaces"
import { OrderDetails } from "../order.details"

export class OrderVoidDetails extends OrderDetails implements OrderVoidDetailsInterface {
  voidAmount: number
  orderState: string
  async execute() {
    const orderId = this.orderId

    const order = await super.execute()

    const { version, taxedPrice, orderState } = order
    const payment = resolveOrderPayment(order)

    return {
      orderId,
      currencyCode: taxedPrice.totalGross.currencyCode,
      voidAmount: taxedPrice.totalGross.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: await this.getTransactionId(order),
      orderState: orderState,
    }
  }
}
