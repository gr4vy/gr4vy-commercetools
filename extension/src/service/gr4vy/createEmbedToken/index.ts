// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { Customer, Cart, PaymentConfig } from "./../../types"

export const createEmbedToken = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const {
    totalPrice: { centAmount, currencyCode },
  } = cart

  const buyerParams: any = {
    amount: centAmount,
    currency: currencyCode,
  }

  const { gr4vyBuyerId } = customer

  // If gr4vyBuyerId is present, pass it as buyerId in the request.
  if (gr4vyBuyerId) {
    buyerParams.buyerId = gr4vyBuyerId.value
  }
  // If the gr4vyBuyerId is not present against cart or customer:
  else if (cart) {
    /* If cart id has a customer id, that will be used as buyer externalIdentifier
     If customer id is not there, anonymous Id is used as buyer externalIdentifier 
  */
    buyerParams.buyerExternalIdentifier = cart.customerId || cart.anonymousId
  }

  return gr4vy.getEmbedToken(buyerParams)
}
