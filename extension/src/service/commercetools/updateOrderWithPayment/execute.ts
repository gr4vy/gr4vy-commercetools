// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants, Order } from "@gr4vy-ct/common"

import { mutation } from "./mutation"
import { responseMapper } from "./mapper"
import { escapedJSON } from "../../../utils"

const updateOrderWithPayment = async ({
  updatedOrder,
  gr4vyTransaction,
}: {
  updatedOrder: Order
  gr4vyTransaction: any
}): Promise<boolean> => {
  const {
    defaultLocale,
    STATES: { CT },
  } = Constants
  const apiClient: ApiClient = new ApiClient()
  const [payment] = updatedOrder?.paymentInfo?.payments || []
  const [transaction] = payment?.transactions || []

  const { id, paymentService, rawResponseCode, rawResponseDescription } = gr4vyTransaction || {}

  const shouldIncludeInterfaceId = !payment.interfaceId
  const shouldIncludeInterface = !payment.paymentMethodInfo.paymentInterface

  apiClient.setBody({
    query: mutation(shouldIncludeInterfaceId, shouldIncludeInterface),
    variables: {
      // For order custom field
      version: updatedOrder.version,
      orderId: updatedOrder.id,
      type: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.TYPE,
      customFieldKey: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.KEY,
      customFieldName: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.NAME,
      gr4vyTransactionId: escapedJSON(gr4vyTransaction.id),
      // Payment
      paymentId: payment?.id,
      paymentVersion: payment.version,
      // Method info
      methodInfoLocale: defaultLocale,
      methodInfoName: paymentService.method,
      // Interface code
      interfaceCode: rawResponseCode,
      // Interface Text
      interfaceText: rawResponseDescription,
      // Interface
      interface: paymentService.displayName,
      // Interface Id as Gr4vy transaction ID
      interfaceId: id,
      // Timestamp
      transactionId: transaction.id,
      timestamp: new Date().toISOString(),
    },
  })
  return responseMapper(await apiClient.getData())
}

export { updateOrderWithPayment }
