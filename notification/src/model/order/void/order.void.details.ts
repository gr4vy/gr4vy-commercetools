import { Payment } from "@commercetools/platform-sdk"

import { OrderDetails } from "../order.details"

export class OrderVoidDetails extends OrderDetails {
  voidAmount: number
  orderState: string
  async execute() {
    const orderId = this.orderId

    const order = await super.execute()

    const { version, taxedPrice, paymentInfo, orderState } = order
    const [payment] = (paymentInfo?.payments || []) as unknown as Payment[]

    return {
      ...order,
      orderId,
      currencyCode: taxedPrice?.totalGross.currencyCode,
      voidAmount: taxedPrice?.totalGross.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: await this.getTransactionId(order),
      orderState: orderState,
    }
  }
}
