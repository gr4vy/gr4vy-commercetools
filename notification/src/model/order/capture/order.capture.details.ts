import { Payment } from "@commercetools/platform-sdk"

import { OrderDetails } from "../order.details"

class OrderCaptureDetails extends OrderDetails {
  totalAmount: number

  async execute() {
    const orderId = this.orderId
    const order = await super.execute()
    const { version, taxedPrice, paymentInfo } = order
    const [payment] = (paymentInfo?.payments || []) as unknown as Payment[]

    return {
      ...order,
      orderId,
      currencyCode: taxedPrice?.totalGross.currencyCode,
      totalAmount: taxedPrice?.totalGross.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: await this.getTransactionId(order),
    }
  }
}

export { OrderCaptureDetails }
