import { ApiClient } from "../../../clients/apiClient"
import { getOrderByIDQuery } from "./query"
import { responseMapper } from "./mapper"

const getOrderApiClient = async ({ orderId }: { orderId: string }) => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: getOrderByIDQuery,
    variables: {
      orderId,
    },
  })

  return responseMapper(await apiClient.getData())
}

export { getOrderApiClient }
