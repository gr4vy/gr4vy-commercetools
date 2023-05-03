import { resolveOrderPayment } from "@gr4vy-ct/common"

import { CaptureOrderDetailsInterface } from "../interfaces"
import { OrderDetails } from "../order.details"

class OrderCaptureDetails extends OrderDetails implements CaptureOrderDetailsInterface {
  totalAmount: number

  async execute() {
    const orderId = this.orderId
    const order = await super.execute()
    const { version, taxedPrice } = order
    const payment = resolveOrderPayment(order)
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
