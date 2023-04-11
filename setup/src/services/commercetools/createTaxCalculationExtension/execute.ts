// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants} from "@gr4vy-ct/common"
import {createExtensionMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import { env } from "process"
import C from "./../../../config/constants"

const createTaxCalculationExtension = async () => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: createExtensionMutationQuery,
    variables: {
      taxCalcLevelExtensionKey: C.CT.EXTENSION.KEY,
      extensionUrl: env.CTP_EXTENSION_URL
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createTaxCalculationExtension }
