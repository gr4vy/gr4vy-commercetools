// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeApiClient } from "@gr4vy-ct/common"

import { getCustomerWithCartQuery } from "./query"
import { responseMapper } from "./mapper"

const getCustomerWithCart = (bearerToken: string) => {
  const meApiClient: MeApiClient = new MeApiClient({
    bearerToken,
  })

  // Get customer and cart from commercetools
  meApiClient.setBody({
    query: getCustomerWithCartQuery,
  })

  return responseMapper(meApiClient.getData())
}

export { getCustomerWithCart }
