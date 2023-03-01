import { IncomingMessage } from "http"

import { MeApiClient } from "../../../clients/meApiClient"
import { updateCTOrderStatusMutation } from "./query"
import { responseMapper } from "./mapper"

const updateStatus = async ({ request, orderId }: { request: IncomingMessage; orderId: string }) => {
  const apiClient: MeApiClient = new MeApiClient({
    request,
  })

  apiClient.setBody({
    query: updateCTOrderStatusMutation,
    variables: {
      orderId,
    },
  })

  const result = responseMapper(await apiClient.getData())

  return result
}

export { updateStatus }
