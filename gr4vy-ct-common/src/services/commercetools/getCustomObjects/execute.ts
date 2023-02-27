import { ApiClient } from "../../../clients/apiClient"
import { getCustomObjectsByContainerQuery, variables } from "./query"
import { responseMapper } from "./mapper"
import { cache, keys } from "../../../cache"

const getCustomObjects = async () => {
  const cacheKey = keys.getGr4vyPaymentConfigCacheKey()

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: getCustomObjectsByContainerQuery,
    variables: variables,
  })

  const result = responseMapper(await apiClient.getData())

  cache.set(cacheKey, result)

  return result
}

export { getCustomObjects }
