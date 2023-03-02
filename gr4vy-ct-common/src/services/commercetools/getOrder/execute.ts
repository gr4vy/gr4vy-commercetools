import { IncomingMessage } from "http"

import { MeApiClient } from "../../../clients/meApiClient"
import { getOrderQuery } from "./query"
import { responseMapper } from "./mapper"

const getOrder = async ({ request, orderId }: { request: IncomingMessage; orderId: string }) => {
  const apiClient: MeApiClient = new MeApiClient({
    request,
  })

  apiClient.setBody({
    query: getOrderQuery,
    variables: {
      orderId,
    },
  })

  const result = responseMapper(await apiClient.getData())

  return result
}

export { getOrder }
