import { ApiClient } from "../../../clients/apiClient"
import { mutationQuery, mutationQueryWithoutTransaction } from "./query"
import { responseMapper, responseMapperWithoutTransaction } from "./mapper"
import { Order } from "./../../types"

const resolveStatus = async ({
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

  const orderPaymentTransactionState = transaction?.state

  if (transactionState === orderPaymentTransactionState) {
    apiClient.setBody({
      query: mutationQueryWithoutTransaction,
      variables: {
        orderId: order.id,
        orderState,
        orderVersion: order.version,
        orderPaymentState,
        orderPaymentVersion: order.version + 1,
      },
    })

    return responseMapperWithoutTransaction(await apiClient.getData())

  } else {
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

    return responseMapper(await apiClient.getData())
  }
}

export { resolveStatus }
