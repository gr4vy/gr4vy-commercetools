// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateCustomerMutation } from "./query"
import { responseMapper } from "./mapper"

const updateCustomer = async (customerId: string, buyer: any) => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updateCustomerMutation,
  })

  return responseMapper(await apiClient.getData())
}

export { updateCustomer }
