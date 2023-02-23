// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Gr4vy } from "@gr4vy-ct/common"

import { UpdateBuyerShippingAddressQuery } from "./../../types"

export const updateBuyerShippingAddress = async ({ updateShippingAddress, paymentConfig }: UpdateBuyerShippingAddressQuery) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  return gr4vy.updateBuyerShippingDetail(updateShippingAddress)
}
