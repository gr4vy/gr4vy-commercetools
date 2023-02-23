// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { getOrderByIDQuery, variables } from "./query"
import { responseMapper } from "./mapper"

const getOrder = async () => {
  const apiClient: ApiClient = new ApiClient()

  // Get Order from CommerceTools
  apiClient.setBody({
    query: getOrderByIDQuery,
    variables: variables,
  })

  return responseMapper(await apiClient.getData())
}

export { getOrder }
