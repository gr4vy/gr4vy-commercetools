import { IncomingMessage } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { escapedJSON } from "../../../utils"
import c from "../../../config/constants"

const updateOrder = async ({
  updatedOrder,
  gr4vyTransactionId,
}: {
  updatedOrder: any
  gr4vyTransactionId: string
}): Promise<boolean> => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: updateOrderMutation,
    variables: {
      version: updatedOrder.version,
      orderId: updatedOrder.id,
      type: c.CTP_GR4VY_TRANSACTION_ID_FIELD.TYPE,
      customFieldKey: c.CTP_GR4VY_TRANSACTION_ID_FIELD.KEY,
      customFieldName: c.CTP_GR4VY_TRANSACTION_ID_FIELD.NAME,
      gr4vyTransactionId: escapedJSON(gr4vyTransactionId),
    },
  })
  return responseMapper(await apiClient.getData())

}

export { updateOrder }
