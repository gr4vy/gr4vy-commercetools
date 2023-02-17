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
