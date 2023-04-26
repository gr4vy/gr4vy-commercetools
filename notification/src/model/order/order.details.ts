// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrderById, getCustomObjects, resolveOrderPayment } from "@gr4vy-ct/common"
import { Order } from "@gr4vy-ct/common/src/services/types"

import { getTransaction } from "../../service"
import { OrderMainInterface } from "./interfaces"

class OrderDetails implements OrderMainInterface {
  orderId: string
  version: string
  paymentVersion: number
  currencyCode: string
  paymentId: string
  paymentTransactionId: string
  // eslint-disable-next-line
  requestBody: any

  // eslint-disable-next-line
  constructor(body: any) {
    this.requestBody = body
    this.orderId = this.requestBody?.orderId
  }

  async getTransactionId(order: Order) {
    const paymentConfig = await getCustomObjects()
    const transaction = await getTransaction({ orderId: order.id, paymentConfig })
    return transaction ? transaction.id : null
  }

  async execute() {
    const orderId = this.orderId

    // Fetch order details from Commercetools
    const order = await getOrderById(orderId)

    if (!order) {
      throw {
        message: `Error during fetching order from CT for orderId: ${orderId}`,
        statusCode: 400,
      }
    }

    const payment = resolveOrderPayment(order)

    if (!payment?.id) {
      throw {
        message: `Required parameter paymentId is missing or empty in order details from CT`,
        statusCode: 400,
      }
    }

    return order
  }
}

export { OrderDetails }
