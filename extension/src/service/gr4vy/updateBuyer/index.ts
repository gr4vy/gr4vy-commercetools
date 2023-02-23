// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//import { Gr4vy } from "@gr4vy-ct/common"

import { Gr4vy } from "@gr4vy-ct/common"

import { UpdateBuyerQuery } from "./../../types"

export const updateBuyerDetails = async ({ updateBuyer, gr4vyBuyerId, paymentConfig }: UpdateBuyerQuery) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  return gr4vy.updateBuyer(updateBuyer, gr4vyBuyerId)
}
