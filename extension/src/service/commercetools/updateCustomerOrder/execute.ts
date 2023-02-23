// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { UpdateGr4vyReference } from "./../../types"
import c from "./../../../config/constants"
import { escapedJSON } from "./../../../utils"

const updateCustomerOrder = async ({
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
      addressDetailId: updateGr4vyReference.addressDetailId,
      addressId: updateGr4vyReference.addressId
    },
  })

  console.log('shippingDetailReturn')
  //return responseMapper(await apiClient.getData())
  const shippingDetailReturn = await apiClient.getData()
  console.log('updateGr4vyReference.addressDetailId')
  console.log(updateGr4vyReference.addressDetailId)
  return shippingDetailReturn
}

export { updateCustomerOrder }
