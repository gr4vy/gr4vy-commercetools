// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants} from "@gr4vy-ct/common"
import {createCustomFieldsMutationQuery} from "./query"
import {responseMapper} from "./mapper"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import C from "./../../../config/constants"

const createCustomFields = async () => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: createCustomFieldsMutationQuery,
    variables: {
      locale: C.defaultLocale,
      buyerIdKey: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_KEY,
      transactionId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_KEY,
      buyerIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_FIELD_DEF_NAME,
      transactionIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_NAME,
      buyerIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_FIELD_DEF_LABEL,
      transactionIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_LABEL,
      buyerIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_NAME_DESC,
      transactionIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_NAME_DESC,
      buyerIdResourceTypeIds: ["order"],
      transactionIdResourceTypeIds: ["order", "transaction"]
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createCustomFields }
