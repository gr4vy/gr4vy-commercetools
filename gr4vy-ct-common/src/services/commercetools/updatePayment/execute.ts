import { ApiClient } from "../../../clients/apiClient"
import { updatePaymentMutation } from "./query"
import { responseMapper } from "./mapper"

const updatePayment = async () => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: updatePaymentMutation,
    variables: {},
  })

  const result = responseMapper(await apiClient.getData())

  return result
}

export { updatePayment }
