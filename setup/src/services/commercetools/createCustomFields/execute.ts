// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants} from "@gr4vy-ct/common"
import {createCustomFieldsQuery} from "./query"
import {responseMapper} from "./mapper"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import C from "./../../../config/constants"

const createCustomFields = async () => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: createCustomFieldsQuery,
    variables: {
      locale: C.defaultLocale,
      key: C.CT.ORDER.CUSTOM_FIELD.GR4VY_BUYERID_KEY,
      //name: C.CT.ORDER.CUSTOM_FIELD.FIELD_DEF_NAME,
      //label: C.CT.ORDER.CUSTOM_FIELD.FIELD_DEF_LABEL
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createCustomFields }
