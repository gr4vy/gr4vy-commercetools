// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { Cart, Customer, PaymentConfig } from "./../../types"
import c from "./../../../config/constants"

export const createBuyer = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: paymentConfig?.debug ? true : false,
  })

  const buyerParams: {
    externalIdentifier?: string | null
    displayName?: string | null
  } = {}

  if (customer) {
    buyerParams.displayName = [customer.firstName, customer.middleName, customer.lastName].join(" ")
    buyerParams.externalIdentifier = customer.id
  } else if (cart) {
    buyerParams.displayName = c.CT_GUEST_USER
    buyerParams.externalIdentifier = cart.anonymousId
  }

  return gr4vy.createBuyer(buyerParams)
}
