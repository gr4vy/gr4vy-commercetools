// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrderById, getCustomObjects } from "@gr4vy-ct/common"
import { Order } from "@gr4vy-ct/common/src/services/types"

import { getTransaction } from '../../service'
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
  constructor(event: any) {
    this.requestBody = this.prepareRequestBody(event)
    this.orderId = this.requestBody?.orderId
  }

  // eslint-disable-next-line
  prepareRequestBody(event: any) {
    if (!event || !event.Records) return {}

    const [record] = event.Records ? event.Records : []
    const { body } = record
    let parsedBody
    if (body) {
      try {
        parsedBody = JSON.parse(body)
      } catch (e) {
        if (e.message.includes("Unexpected token")) {
          parsedBody = body
        } else {
          return {}
        }
      }
      const typeId = parsedBody?.resource?.typeId
      if (typeId && typeId === "order") {
        parsedBody.orderId = parsedBody.resource.id
      }
    }
    if (!parsedBody || !parsedBody.orderId) {
      throw {
        message: `Required parameter orderId is missing or empty`,
        statusCode: 400,
      }
    }
    return parsedBody || {}
  }

  async getTransactionId(order: Order) {
    const paymentConfig = await getCustomObjects()
    const transaction = await getTransaction({orderId: order.id, paymentConfig})
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

    const { paymentInfo } = order

    const [payment] = paymentInfo?.payments || []

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
