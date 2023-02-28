// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerMutation } from "./query"
import { responseMapper } from "./mapper"
import { Cart, Customer } from "../../types"
import c from "../../../config/constants"
import { escapedJSON } from "../../../utils"

const updateCustomerCart = async ({
  customer,
  cart,
  buyer,
}: {
  customer: Customer
  cart: Cart
  buyer: { id: string }
}): Promise<boolean> => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updateCustomerMutation,
    variables: {
      buyerId: escapedJSON(buyer.id),
      ctpCustFieldName: c.CTP_GR4VY_BUYER_ID_FIELD.NAME,
      ctpCustFieldType: c.CTP_GR4VY_BUYER_ID_FIELD.TYPE,

      customerVersion: customer.version,
      customerId: customer.id,
      ctpCustFieldCustomerKey: c.CTP_GR4VY_BUYER_ID_FIELD.CUSTOMER_KEY,

      cartId: cart.id,
      cartVersion: cart.version,
      ctpCustFieldOrderKey: c.CTP_GR4VY_BUYER_ID_FIELD.ORDER_KEY,
    },
  })

  return responseMapper(await apiClient.getData())
}

export { updateCustomerCart }
