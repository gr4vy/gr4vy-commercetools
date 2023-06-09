import { IncomingMessage } from "http"

import { MeApiClient } from "@gr4vy-ct/common"

import { updateCartMutation } from "./query"
import { Cart } from "../../types"
import { responseMapper } from "./mapper"
import { escapedJSON } from "../../../utils"
import c from "../../../config/constants"

const updateMyCart = async ({
  request,
  cart,
  buyer,
}: {
  request: IncomingMessage
  cart: Cart
  buyer: { id: string }
}): Promise<boolean> => {
  const meApiClient: MeApiClient = new MeApiClient({
    request,
  })

  meApiClient.setBody({
    query: updateCartMutation,
    variables: {
      buyerId: escapedJSON(buyer.id),
      ctpCustFieldName: c.CTP_GR4VY_BUYER_ID_FIELD.NAME,
      ctpCustFieldType: c.CTP_GR4VY_BUYER_ID_FIELD.TYPE,
      ctpCustFieldCustomerKey: c.CTP_GR4VY_BUYER_ID_FIELD.CUSTOMER_KEY,
      cartId: cart.id,
      cartVersion: cart.version,
      ctpCustFieldOrderKey: c.CTP_GR4VY_BUYER_ID_FIELD.ORDER_KEY,
    },
  })

  return responseMapper(await meApiClient.getData())
}

export { updateMyCart }
