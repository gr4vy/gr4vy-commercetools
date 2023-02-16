// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { CreateBuyer } from "./../../types"

export const createBuyer = async ({ customer, cart, paymentConfig }: CreateBuyer) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  //If cart id has a customer id, that will be used as buyer externalIdentifier
  //If customer id is not there, anonymous Id is used as buyer externalIdentifier

  let externalIdentifier = "gr4vy_buyer_id" //TODO: get buyer id from CT

  if (cart) {
    externalIdentifier = cart.customerId || cart.anonymousId
  }

  const buyerParams = {
    displayName: `${customer.firstName} ${customer.middleName} ${customer.lastName}`,
    externalIdentifier,
  }

  return gr4vy.createBuyer(buyerParams)
}
