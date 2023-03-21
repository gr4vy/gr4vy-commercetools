// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getOrderById } from "@gr4vy-ct/common"
import { Order } from "@gr4vy-ct/common/src/services/types"

import {OrderMainInterface} from "./interfaces"

class OrderDetails implements OrderMainInterface {
  orderId: string
  version: string
  paymentVersion: number
  currencyCode: string
  paymentId: string
  paymentTransactionId: string

  constructor(orderId: string) {
    this.orderId = orderId
  }

  getTransactionId(order:Order) {
    const customFieldsRaw = order?.custom?.customFieldsRaw
    const customFieldsItem = customFieldsRaw.find((fieldItem) => fieldItem.name === 'gr4vyTransactionId')
    return customFieldsItem ? customFieldsItem.value : ''
  }
}

export { OrderDetails }
