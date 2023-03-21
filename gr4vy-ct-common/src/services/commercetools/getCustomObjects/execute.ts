import { ApiClient } from "../../../clients/apiClient"
import { getCustomObjectsByContainerQuery, variables } from "./query"
import { responseMapper } from "./mapper"
import { cache, keys } from "../../../cache"
import { PaymentConfig } from "../../../services/types"

const getCustomObjects = async (): Promise<PaymentConfig> => {
  const cacheKey = keys.getGr4vyPaymentConfigCacheKey()

  if (cache.has(cacheKey)) {
    const config: PaymentConfig = cache.get(cacheKey) || ({} as PaymentConfig)
    return config
  }
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: getCustomObjectsByContainerQuery,
    variables: variables,
  })

  const result: PaymentConfig = responseMapper(await apiClient.getData())

  cache.set(cacheKey, result)

  return result
}

export { getCustomObjects }
