// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerMutation } from "./query"
import { responseMapper } from "./mapper"
import { Customer } from "./../../types"
import c from "./../../../config/constants"
import { escapedJSON } from "./../../../utils"

const updateCustomer = async ({
  customer,
  buyer,
}: {
  customer: Customer
  buyer: { id: string }
}): Promise<boolean> => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updateCustomerMutation,
    variables: {
      version: customer.version,
      customerId: customer.id,
      buyerId: escapedJSON(buyer.id),
      ctpCustomFieldNameForGr4vyBuyerId: c.CTP_GR4VY_BUYER_FIELD_ID,
    },
  })

  return responseMapper(await apiClient.getData())
}

export { updateCustomer }
