import { IncomingMessage } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeApiClient } from "@gr4vy-ct/common"

import { updateCustomerMutation } from "./query"
import { responseMapper } from "./mapper"
import { Cart, Customer } from "../../types"
import c from "../../../config/constants"
import { escapedJSON } from "../../../utils"

const updateMyCustomerCart = async ({
  request,
  customer,
  cart,
  buyer,
}: {
  request: IncomingMessage
  customer: Customer
  cart: Cart
  buyer: { id: string }
}): Promise<boolean> => {
  const meApiClient: MeApiClient = new MeApiClient({
    request,
  })

  meApiClient.setBody({
    query: updateCustomerMutation,
    variables: {
      buyerId: escapedJSON(buyer.id),
      ctpCustFieldName: c.CTP_GR4VY_BUYER_ID_FIELD.NAME,
      ctpCustFieldType: c.CTP_GR4VY_BUYER_ID_FIELD.TYPE,

      customerVersion: customer.version,
      ctpCustFieldCustomerKey: c.CTP_GR4VY_BUYER_ID_FIELD.CUSTOMER_KEY,

      cartId: cart.id,
      cartVersion: cart.version,
      ctpCustFieldOrderKey: c.CTP_GR4VY_BUYER_ID_FIELD.ORDER_KEY,
    },
  })

  return responseMapper(await meApiClient.getData())
}

export { updateMyCustomerCart }
