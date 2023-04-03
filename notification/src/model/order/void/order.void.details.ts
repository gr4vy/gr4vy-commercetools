import { OrderVoidDetailsInterface } from "../interfaces"
import { OrderDetails } from "../order.details"

export class OrderVoidDetails extends OrderDetails implements OrderVoidDetailsInterface {
  voidAmount: number
  orderState: string
  async execute() {
    const orderId = this.orderId

    const order = await super.execute()

    const { version, totalPrice, paymentInfo, orderState } = order
    const [payment] = paymentInfo?.payments || []

    return {
      orderId,
      currencyCode: totalPrice.currencyCode,
      voidAmount: totalPrice.centAmount,
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: this.getTransactionId(order),
      orderState: orderState,
    }
  }
}
