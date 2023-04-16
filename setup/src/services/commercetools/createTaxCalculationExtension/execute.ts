// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { env } from "process"

import { ApiClient} from "@gr4vy-ct/common"

import {createExtensionMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import C from "./../../../config/constants"

const createTaxCalculationExtension = async () => {
  const apiClient = new ApiClient()
  apiClient.setBody({
    query: createExtensionMutationQuery,
    variables: {
      taxCalcLevelExtensionKey: C.CT.EXTENSION.KEY,
      extensionUrl: env.CTP_EXTENSION_URL,
      authHeader: env.CTP_EXTENSION_AUTH_HEADER || ""
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createTaxCalculationExtension }
