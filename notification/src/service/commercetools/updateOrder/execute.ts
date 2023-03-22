// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { OrderUpdate } from "./../../types"

const updateOrder = async ({ orderUpdate }: { orderUpdate: OrderUpdate }): Promise<boolean> => {
  const findFor = ["{repl}orderState:{/repl}", "{repl}paymentState:{/repl}"]
  const replaceWith = [
    "orderState:" + orderUpdate.orderState,
    "paymentState:" + orderUpdate.paymentState,
  ]
  let updateOrderMutationQuery = updateOrderMutation
  findFor.forEach(
    (tag, i) =>
      (updateOrderMutationQuery = updateOrderMutationQuery.replace(
        new RegExp(tag, "g"),
        replaceWith[i]
      ))
  )
  if (updateOrderMutationQuery.length) {
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: updateOrderMutationQuery,
      variables: {
        version: orderUpdate.version,
        orderId: orderUpdate.orderId,
      },
    })
    return responseMapper(await apiClient.getData())
  } else {
    return false
  }
}

export { updateOrder }
