import { CaptureOrderDetailsInterface } from "../interfaces"
import { OrderDetails } from "../order.details"

class OrderCaptureDetails extends OrderDetails implements CaptureOrderDetailsInterface {
  totalAmount: number

  async execute() {
    const orderId = this.orderId
    const order = await super.execute()
    const { version, totalPrice, paymentInfo } = order
    const [payment] = paymentInfo?.payments || []
    return {
      orderId,
      currencyCode: totalPrice.currencyCode,
      totalAmount: totalPrice.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: this.getTransactionId(order),
    }
  }
}

export { OrderCaptureDetails }
