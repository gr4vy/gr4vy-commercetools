// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { Cart, Customer, PaymentConfig } from "./../../types"

export const createBuyer = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: paymentConfig?.value?.debug ? true : false
  })

  const buyerParams: any = {}

  if (customer) {
    buyerParams.displayName = `${customer.firstName} ${customer.middleName} ${customer.lastName}`
    buyerParams.externalIdentifier = customer.id
  } else if (cart) {
    buyerParams.displayName = 'ct_guest_user';
    buyerParams.externalIdentifier = cart.anonymousId
  }

  return gr4vy.createBuyer(buyerParams)
}
