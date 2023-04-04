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
      buyerId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_KEY,
      customerBuyerId: C.CT.CUSTOMER.CUSTOM_FIELD.GR4VY_CUSTOMER_BUYER_ID_KEY,
      transactionId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_KEY,
      refundId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_KEY,
      responseId: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_KEY,
      buyerIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_FIELD_DEF_NAME,
      customerBuyerIdName: C.CT.CUSTOMER.CUSTOM_FIELD.GR4VY_CUSTOMER_BUYER_ID_FIELD_DEF_NAME,
      transactionIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_NAME,
      refundIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_FIELD_DEF_NAME,
      responseIdName: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_FIELD_DEF_NAME,
      buyerIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_FIELD_DEF_LABEL,
      customerBuyerIdLabel: C.CT.CUSTOMER.CUSTOM_FIELD.GR4VY_CUSTOMER_BUYER_ID_FIELD_DEF_LABEL,
      transactionIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_FIELD_DEF_LABEL,
      refundIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_FIELD_DEF_LABEL,
      responseIdLabel: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_FIELD_DEF_LABEL,
      buyerIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYER_ID_NAME_DESC,
      customerBuyerIdDescription: C.CT.CUSTOMER.CUSTOM_FIELD.GR4VY_CUSTOMER_BUYER_ID_NAME_DESC,
      transactionIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_TRANSACTION_ID_NAME_DESC,
      refundIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_REFUND_ID_NAME_DESC,
      responseIdDescription: C.CT.ORDER.CUSTOM_FIELD.GR4VY_RESPONSE_ID_NAME_DESC,
      buyerIdResourceTypeIds: ["order"],
      customerBuyerIdResourceTypeIds: ["customer"],
      transactionIdResourceTypeIds: ["order", "transaction"],
      refundIdResourceTypeIds: ["transaction"],
      responseIdResourceTypeIds: ["transaction"]
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createCustomFields }
