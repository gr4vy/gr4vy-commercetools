// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { Customer, Cart, PaymentConfig, CartItem } from "./../../types"

export const createEmbedToken = async ({
  customer,
  cart,
  paymentConfig,
  cartItems,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
  cartItems: CartItem[]
}) => {
  const { gr4vyId, privateKey, metadata } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const {
    totalPrice: { centAmount, currencyCode },
  } = cart

  const params: any = {
    amount: centAmount,
    currency: currencyCode,
    metadata,
    cartItems,
  }

  const { gr4vyBuyerId } = customer || {}

  // If gr4vyBuyerId is present, pass it as buyerId in the request.
  if (gr4vyBuyerId) {
    params.buyerId = gr4vyBuyerId.value
  }
  // If the gr4vyBuyerId is not present against cart or customer:
  else if (cart) {
    /* If cart id has a customer id, that will be used as buyer externalIdentifier
     If customer id is not there, anonymous Id is used as buyer externalIdentifier 
  */
    params.buyerExternalIdentifier = cart.customerId || cart.anonymousId
  }

  return gr4vy.getEmbedToken(params)
}
