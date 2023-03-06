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
  const { gr4vyId, privateKey, metadata: customData } = paymentConfig.value || {}

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
    metadata: {
      ct_custom_data: customData    },  //TBD: convert to proper meta data.
    cartItems,
  }

  const { gr4vyBuyerId } = customer ?? cart;
  if(!gr4vyBuyerId) {
    throw {
      message: "Missing Buyer Id",
      statusCode: 400,
    }
  }

  params.buyerId = gr4vyBuyerId.value

  console.log("Debug", params);

  return gr4vy.getEmbedToken(params)
}
