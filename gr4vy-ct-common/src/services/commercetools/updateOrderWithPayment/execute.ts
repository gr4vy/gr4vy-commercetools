import { Order, Payment } from "@commercetools/platform-sdk"

import { ApiClient } from "../../../clients/apiClient"
import { Gr4vyTransactionResponse, UpdateOrderWithPaymentResponse } from "./../../types"
import { Constants } from "./../../../config"
import { mutation } from "./mutation"
import { responseMapper } from "./mapper"

const updateOrderWithPayment = async ({
  order,
  orderState,
  orderPaymentState,
  transactionState,
  gr4vyTransaction,
}: {
  order: Order
  orderState: string
  orderPaymentState: string
  transactionState: string
  gr4vyTransaction: Gr4vyTransactionResponse
}): Promise<UpdateOrderWithPaymentResponse> => {
  const {
    defaultLocale,
  } = Constants

  const apiClient: ApiClient = new ApiClient()

  const [payment] = (order?.paymentInfo?.payments || [])  as unknown as Payment[]
  const [transaction] = payment?.transactions || []
  const { id, paymentService, rawResponseCode, rawResponseDescription } = gr4vyTransaction || {}

  const shouldIncludeInterfaceId = !payment?.interfaceId
  const shouldIncludeInterface = !payment?.paymentMethodInfo?.paymentInterface
  const shouldUpdateCTTransactionState = !(transactionState === transaction?.state)

  apiClient.setBody({
    query: mutation(
      shouldIncludeInterfaceId,
      shouldIncludeInterface,
      shouldUpdateCTTransactionState
    ),
    variables: {
      // For order custom field
      version: order.version,
      orderId: order.id,
      // Payment
      paymentId: payment?.id,
      paymentVersion: payment.version,
      // Method info
      methodInfoLocale: defaultLocale,
      methodInfoName: paymentService.method,
      // Interface code
      interfaceCode: rawResponseCode || "",
      // Interface Text
      interfaceText: rawResponseDescription || "",
      // Interface
      interface: paymentService.displayName,
      // Interface Id as Gr4vy transaction ID
      interfaceId: id,
      // Timestamp
      transactionId: transaction.id,
      timestamp: new Date().toISOString(),
      // Order statuses
      orderState,
      orderPaymentState,
      transactionState,
    },
  })
  return responseMapper(await apiClient.getData())
}

export { updateOrderWithPayment }
