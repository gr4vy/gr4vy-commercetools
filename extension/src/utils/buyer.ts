import {
  getBuyer as getGr4vyBuyer,
  createBuyer as createGr4vyBuyer,
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

  return items && items.length > 0 ? items[0] : null
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
  customer,
  cart,
  paymentConfig,
}: {
  customer: Customer | null
  cart: Cart
  paymentConfig: PaymentConfig
}) => {
  let buyer = await getBuyer({ customer, cart, paymentConfig })
  if (!buyer) {
    buyer = await createBuyer({ customer, cart, paymentConfig })
  }
  if (!buyer) {
    throw {
      message: "Unable to find or create Buyer in Gr4vy",
      statusCode: 400,
    }
  }
  if (customer) {
    // Set gr4vyBuyerId in customer
    customer.gr4vyBuyerId = {
      value: buyer.id || "",
    }
  } else {
    // Set gr4vyBuyerId in cart
    cart.gr4vyBuyerId = {
      value: buyer.id || "",
    }
  }
}

export { getBuyer, createBuyer, resolveCustomerBuyerId }
