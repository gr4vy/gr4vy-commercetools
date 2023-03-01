// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { UpdateGr4vyReference } from "./../../types"
import c from "./../../../config/constants"
import { escapedJSON } from "./../../../utils"

const updateCustomerCartAddress = async ({
  updateGr4vyReference
}: {
  updateGr4vyReference: UpdateGr4vyReference
}): Promise<boolean> => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updateCustomerOrderMutation,
    variables: {
      version: updateGr4vyReference.customerVersion,
      customerId: updateGr4vyReference.customerId,
      ctCustomFieldNameForGr4vyBuyerAddressId: c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS,
      addressDetailId: escapedJSON(updateGr4vyReference.addressDetailId),
      addressId: updateGr4vyReference.addressId
    },
  })

  return responseMapper(await apiClient.getData())
}

export { updateCustomerCartAddress }
