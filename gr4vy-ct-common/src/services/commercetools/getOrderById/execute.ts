// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "../../../clients/apiClient"
import { getOrderDetailsQuery } from "./query"
import { responseMapper } from "./mapper"

const getOrderById = async (orderId: string) => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: getOrderDetailsQuery,
    variables: {
      orderId: orderId,
    },
  })
  return await responseMapper(await apiClient.getData())
}

export { getOrderById }
