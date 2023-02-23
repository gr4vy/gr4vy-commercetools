export declare type Customer = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  version: string
  gr4vyBuyerId: {
    name?: string
    value: string
  }
}

export declare type Cart = {
  id: string
  customerId: string
  anonymousId: string
  totalPrice: {
    currencyCode: string
    centAmount: number
  }
}

export declare type PaymentConfig = {
  id: string
  key: string
  container: string
  value: { [key: string]: string }
}

export declare type CreateBuyer = {
  customer: Customer
  cart: Cart
  paymentConfig: PaymentConfig
}

export declare type UpdateBuyer = {
  external_identifier: string
  display_name: string
  billing_details: {
    email_address: string
    first_name: string
    last_name: string
    phone_number: string
    address: {
      city: string
      country: string
      line1: string
      postal_code: string
      state: string
    }
  }
}

export declare type UpdateBuyerQuery = {
  updateBuyer: UpdateBuyer
  gr4vyBuyerId: Gr4vyBuyerId
  paymentConfig: PaymentConfig
}

export declare type Gr4vyBuyerId = {
  gr4vyBuyerId: string
}

export declare type UpdateBuyerShippingAddressQuery = {
  updateShippingAddress: UpdateShippingAddress
  paymentConfig: PaymentConfig
}

export declare type UpdateShippingAddress = {
  email_address: string
  first_name: string
  last_name: string
  phone_number: string
  address: {
    city: string
    country: string
    line1: string
    postal_code: string
    state: string
  }
  buyerId: string
  buyerShippingId: string
}
