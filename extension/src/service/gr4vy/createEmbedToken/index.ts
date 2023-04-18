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
  const { gr4vyId, privateKey, metadata } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: paymentConfig?.debug ? true : false,
  })

  const {
    taxedPrice: {
      totalGross: { centAmount, currencyCode },
    },
  } = cart

  const params: any = {
    amount: centAmount,
    currency: currencyCode,
    metadata,
    cartItems,
  }

  const gr4vyBuyerId = customer?.gr4vyBuyerId ?? cart.gr4vyBuyerId

  if (!gr4vyBuyerId) {
    throw {
      message: "Missing Buyer Id",
      statusCode: 400,
    }
  }

  params.buyerId = gr4vyBuyerId.value

  return gr4vy.getEmbedToken(params)
}
