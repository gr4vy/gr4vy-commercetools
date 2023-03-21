// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants, getOrderById } from "@gr4vy-ct/common"
import { Order } from "@gr4vy-ct/common/src/services/types"

import { OrderRefundDetailsInterface } from "./interfaces"
import { RefundMessageObject } from "../../types"
import { OrderDetails } from "./order.details"

export class OrderRefundDetails extends OrderDetails implements OrderRefundDetailsInterface {
  refundAmount: number

  private refundObject: RefundMessageObject

  constructor(orderId: string, refundObject: RefundMessageObject) {
    super(orderId)
    this.refundObject = refundObject
  }

  getRefundAmount(refundObject: RefundMessageObject, order: Order): number {
    let totalRefundAmount = 0
    order.lineItems.find(function (lineItem) {
      refundObject.items.find(function (refundItem) {
        if (refundItem.lineItemId == lineItem.id) {
          totalRefundAmount += lineItem.price.value.centAmount * refundItem.quantity
        }
      })
    })
    return totalRefundAmount
  }

  async execute() {
    const orderId = this.orderId

    // Fetch order details from Commercetools
    const order = await getOrderById(orderId)

    if (!order) {
      return
    }

    const {
      STATES: { CT },
    } = Constants

    // eslint-disable-next-line
    order.returnInfo.forEach((returnInfo: { items: any[] }) => {
      returnInfo.items.forEach(returnItem => {
        this.refundObject.items.find(function (refundItem) {
          if (
            refundItem.id == returnItem.id &&
            returnItem.paymentState == CT.ORDER_RETURN_PAYMENT.REFUNDED
          ) {
            throw new Error(
              "Return Items contain some items those were already refunded - " + returnItem.id
            )
          }
        })
      })
    })

    const { version, totalPrice, paymentInfo } = order

    const [payment] = paymentInfo?.payments || []

    if (!payment?.id) {
      return
    }

    return {
      orderId,
      currencyCode: totalPrice.currencyCode,
      refundAmount: this.getRefundAmount(this.refundObject, order),
      version,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      paymentTransactionId: this.getTransactionId(order),
    }
  }
}
