// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Constants } from "@gr4vy-ct/common"
import { Order } from "@gr4vy-ct/common/src/services/types"

import { OrderMainInterface } from "./interfaces"

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

  getTransactionId(order: Order) {
    const {
      STATES: { CT },
    } = Constants
    const customFieldsRaw = order?.custom?.customFieldsRaw
    const customFieldsItem = customFieldsRaw.find(
      fieldItem => fieldItem.name === CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.KEY
    )
    return customFieldsItem ? customFieldsItem.value : ""
  }
}

export { OrderDetails }
