// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { getCustomObjectsByContainerQuery, variables } from "./query"
import { responseMapper } from "./mapper"

const getCustomObjects = () => {
  const apiClient: ApiClient = new ApiClient()

  // Get customer and cart from commercetools
  apiClient.setBody({
    query: getCustomObjectsByContainerQuery,
    variables: variables,
  })

  return responseMapper(apiClient.getData())
}

export { getCustomObjects }