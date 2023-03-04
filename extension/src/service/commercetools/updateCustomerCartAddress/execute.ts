// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { UpdateBuyerQuery } from "./../../types"
import c from "./../../../config/constants"
import { escapedJSON } from "./../../../utils"

const updateCustomerCartAddress = async ({ customer, cart }: UpdateBuyerQuery): Promise<boolean> => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updateCustomerOrderMutation,
    variables: {
      version: customer?.version,
      customerId: customer?.id?customer.id:cart.anonymousId,
      ctCustomFieldNameForGr4vyBuyerAddressId: c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS,
      addressDetailId: escapedJSON(cart.gr4vyShippingDetailId),
      addressId: cart.shippingAddress.id
    },
  })

  return responseMapper(await apiClient.getData())
}

export { updateCustomerCartAddress }
