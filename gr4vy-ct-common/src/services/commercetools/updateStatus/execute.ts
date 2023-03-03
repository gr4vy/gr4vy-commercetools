import { ApiClient } from "../../../clients/apiClient"
import { mutationQuery } from "./query"
import { responseMapper } from "./mapper"
import { Order } from "./../../types"

const updateStatus = async ({
  order,
  orderState,
  orderPaymentState,
  transactionState,
}: {
  order: Order
  orderState: string
  orderPaymentState: string
  transactionState: string
}) => {
  const apiClient: ApiClient = new ApiClient()

  const [payment] = order?.paymentInfo?.payments || []
  const [transaction] = payment?.transactions || []

  apiClient.setBody({
    query: mutationQuery,
    variables: {
      orderId: order.id,
      orderState,
      orderVersion: order.version,
      orderPaymentState,
      orderPaymentVersion: order.version + 1,
      paymentId: payment?.id,
      paymentVersion: payment?.version,
      transactionId: transaction?.id,
      transactionState,
    },
  })

  const result = responseMapper(await apiClient.getData())

  return result
}

export { updateStatus }
