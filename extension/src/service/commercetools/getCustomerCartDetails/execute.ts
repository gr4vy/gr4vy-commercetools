// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeApiClient } from "@gr4vy-ct/common"

import { getCustomerWithCartDetailsQuery } from "./query"
import { responseMapper } from "./mapper"
import c from "./../../../config/constants"
import {IncomingMessage} from "http";

const getCustomerWithCartDetails = async (request: IncomingMessage) => {
  const meApiClient: MeApiClient = new MeApiClient({
    request,
  })

  // Get customer active cart, shipping and billing address from commerceTools
  meApiClient.setBody({
    query: getCustomerWithCartDetailsQuery,
    variables: {
      locale: c.defaultLocale,
    },
  })

  return await responseMapper(await meApiClient.getData())
}

export { getCustomerWithCartDetails }
