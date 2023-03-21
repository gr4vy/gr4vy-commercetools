import { IncomingMessage } from "http"

import {
  getBuyer as getGr4vyBuyer,
  createBuyer as createGr4vyBuyer,
  updateMyCustomerCart,
  updateMyCart,
} from "../service"
import { Cart, Customer, PaymentConfig } from "../service/types"

const getBuyer = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  //if there is no gr4vy buyer Id against cart or customer, see if it is there in Gr4vy.
  const userId = customer?.id ?? cart.anonymousId
  const {
    body: { items },
  } = await getGr4vyBuyer({ userId, paymentConfig })

  return items.length > 0 ? items[0] : null
}

const createBuyer = async ({
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  const { body: buyer } = await createGr4vyBuyer({ customer, cart, paymentConfig })
  if (!buyer) {
    throw { message: "Error in creating buyer in CTP for customer", statusCode: 400 }
  }
  return buyer
}

const resolveCustomerBuyerId = async ({
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
  let buyer = await getBuyer({ customer, cart, paymentConfig })
  if (!buyer) {
    buyer = await createBuyer({ customer, cart, paymentConfig })
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
}

export { getBuyer, createBuyer, resolveCustomerBuyerId }
