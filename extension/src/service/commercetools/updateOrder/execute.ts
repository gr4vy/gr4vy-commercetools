import { IncomingMessage } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants } from "@gr4vy-ct/common"

import { updateOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { escapedJSON } from "../../../utils"

const updateOrder = async ({
  updatedOrder,
  gr4vyTransactionId,
}: {
  updatedOrder: any
  gr4vyTransactionId: string
}): Promise<boolean> => {
  const {
    STATES: { CT },
  } = Constants
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: updateOrderMutation,
    variables: {
      version: updatedOrder.version,
      orderId: updatedOrder.id,
      type: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.TYPE,
      customFieldKey: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.KEY,
      customFieldName: CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.NAME,
      gr4vyTransactionId: escapedJSON(gr4vyTransactionId),
    },
  })
  return responseMapper(await apiClient.getData())

}

export { updateOrder }
