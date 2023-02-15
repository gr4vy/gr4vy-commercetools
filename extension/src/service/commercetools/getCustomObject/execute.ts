// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { getCustomObjectsByContainerQuery, variables } from "./query"
import { responseMapper } from "./mapper"
import { cache, keys } from "./../../../cache"

const getCustomObjects = () => {
  const cacheKey = keys.getGr4vyPaymentConfigCacheKey()

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  const apiClient: ApiClient = new ApiClient()

  // Get customer and cart from commercetools
  apiClient.setBody({
    query: getCustomObjectsByContainerQuery,
    variables: variables,
  })

  const result = responseMapper(apiClient.getData())

  cache.set(cacheKey, result)

  return result
}

export { getCustomObjects }
