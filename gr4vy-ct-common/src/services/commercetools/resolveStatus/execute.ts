import { ApiClient } from "../../../clients/apiClient"
import { mutationQuery, mutationQueryWithoutTransaction } from "./query"
import { responseMapper, responseMapperWithoutTransaction } from "./mapper"
import { Order } from "./../../types"

const resolveStatus = async ({
  order,
  orderState,
  orderPaymentState,
  transactionState,
  interfaceText,
  interfaceCode,
}: {
  order: Order
  orderState: string
  orderPaymentState: string
  transactionState: string
  interfaceText: string
  interfaceCode: string
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
        interfaceText,
        interfaceCode,
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
        paymentId: payment?.id,
        paymentVersion: payment?.version,
        transactionId: transaction?.id,
        transactionState,
        interfaceText,
        interfaceCode,
        // Timestamp
        timestamp: new Date().toISOString(),
      },
    })

    return responseMapper(await apiClient.getData())
  }
}

export { resolveStatus }
