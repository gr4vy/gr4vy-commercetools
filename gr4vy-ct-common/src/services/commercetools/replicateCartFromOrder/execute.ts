import { ApiClient } from "../../../clients/apiClient"
import { replicateCartFromOrderQuery } from "./query"
import { responseMapper } from "./mapper"

const replicateCartFromOrder = async ({ orderId }: { orderId: string }) => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: replicateCartFromOrderQuery,
    variables: {
      orderId,
    },
  })
  return responseMapper(await apiClient.getData())
}

export { replicateCartFromOrder }
