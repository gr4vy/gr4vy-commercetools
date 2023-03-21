import { IncomingMessage } from "http"

import { getBuyer, createBuyer, updateMyCustomerCart, updateMyCart } from "../service"
import { Cart, Customer, PaymentConfig } from "../service/types"

const checkIfBuyerExists = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}): Promise<boolean> => {
  //if there is no gr4vy buyer Id against cart or customer, see if it is there in Gr4vy.
  const userId = customer?.id ?? cart.anonymousId
  const {
    body: { items },
  } = await getBuyer({ userId, paymentConfig })

  return !!items.length
}

const createBuyerAndUpdateCT = async ({
  request,
  customer,
  cart,
  paymentConfig,
}: {
  request: IncomingMessage
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  const { body: buyer } = await createBuyer({ customer, cart, paymentConfig })
  if (!buyer) {
    throw { message: "Error in creating buyer in CTP for customer", statusCode: 400 }
  }

  // Update CT customer and cart with buyer info
  if (customer) {
    const isMyCustomerCartUpdated = await updateMyCustomerCart({
      request,
      customer,
      cart,
      buyer,
    })
    if (!isMyCustomerCartUpdated) {
      throw {
        message: "Error in updating buyer id in CTP for customer and cart",
        statusCode: 400,
      }
    }
    // Set gr4vyBuyerId in customer
    customer.gr4vyBuyerId = {
      value: buyer.id,
    }
  } else {
    //Update Cart with buyer Id
    const isMyCartUpdated = await updateMyCart({ request, cart, buyer })
    if (!isMyCartUpdated) {
      throw {
        message: "Error in updating buyer id in CTP for guest cart",
        statusCode: 400,
      }
    }

    // Set gr4vyBuyerId in cart
    cart.gr4vyBuyerId = {
      value: buyer.id,
    }
  }

  return buyer
}

export { checkIfBuyerExists, createBuyerAndUpdateCT }
