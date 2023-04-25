import { ApiClient, Constants} from "@gr4vy-ct/common"

import {createCustomFieldsMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import C from "./../../../config/constants"

const createCustomFields = async () => {
  const apiClient = new ApiClient()
  apiClient.setBody({
    query: createCustomFieldsMutationQuery,
    variables: {
      locale: C.defaultLocale,
      transactionId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_KEY,
      refundId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_KEY,
      responseId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_KEY,
      transactionIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_NAME,
      refundIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_FIELD_DEF_NAME,
      responseIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_FIELD_DEF_NAME,
      transactionIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_LABEL,
      refundIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_FIELD_DEF_LABEL,
      responseIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_FIELD_DEF_LABEL,
      transactionIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_NAME_DESC,
      refundIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_NAME_DESC,
      responseIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_NAME_DESC,
      transactionIdResourceTypeIds: ["transaction"],
      refundIdResourceTypeIds: ["transaction"],
      responseIdResourceTypeIds: ["transaction"]
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createCustomFields }
