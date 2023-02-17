// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { CreateBuyer } from "./../../types"

export const createBuyer = async ({ customer, paymentConfig }: CreateBuyer) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const buyerParams = {
    displayName: `${customer.firstName} ${customer.middleName} ${customer.lastName}`,
  }

  return gr4vy.createBuyer(buyerParams)
}
