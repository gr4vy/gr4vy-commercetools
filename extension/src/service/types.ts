export declare type Customer = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  version: string
  custom: {
    customFieldsRaw?: {
      name: string
      value: string
    }
  }
  gr4vyBuyerId?: {
    name?: string
    value: string
  }
  externalIdentifier: string
  displayName: string
}

export declare type Cart = {
  id: string
  version: string
  customerId: string | null
  anonymousId: string
  totalPrice: {
    currencyCode: string
    centAmount: number
  }
  lineItems: CartLineItem
  country: string
  locale: string
  gr4vyBuyerId?: {
    name?: string
    value: string
  }
  gr4vyShippingDetailId: string
  billingAddress: CtCustomerAddress
  shippingAddress: CtCustomerAddress
  shippingInfo: CtShippingInfo
}

export declare type PaymentConfig = {
  id: string
  key: string
  container: string
  value: { [key: string]: string }
}

export declare type CartLineItem = {
  id: string
  name: string
  productId: string
  taxedPrice: {
    totalTax: {
      currencyCode: string
      centAmount: number
    }
  }
  quantity: number
  discountedPricePerQuantity: {
    discountedPrice: {
      value: {
        currencyCode: string
        centAmount: number
      }
    }
  }
  price: {
    value: {
      currencyCode: string
      centAmount: number
    }
  }
  productType: {
    name: string
  }
  variant: {
    id: string
    sku: string
    images: [
      {
        url: string
      }
    ]
  }
}

export declare type CartItem = {
  name: string
  quantity: number
  unitAmount?: number
  discountAmount?: number | null
  taxAmount?: number | null
  externalIdentifier: string
  sku?: string | null
  imageUrl?: string | null
  categories?: string[] | null
  productType: string | null
}

export declare type CustomerCartResult = {
  body: {
    data: {
      me: {
        customer: Customer | null
        activeCart: Cart
      }
    }
  }
}

export declare type ProductMasterDataCurrent = {
  id: string
  masterData: {
    current: {
      categories: [
        {
          id: string
          key: string
          name: string
        }
      ]
    }
  }
}

export declare type CtCustomerAddress = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  city?: string
  country?: string
  streetName?: string
  streetNumber?: string
  postalCode?: string
  state?: string
  building?: string
  apartment?: string
  region?: string
  custom: {
    customFieldsRaw?: {
      name: string
      value: string
    }
  }
  gr4vyShippingDetailId?: {
    name?: string
    value: string
  }
}

export declare type UpdateBuyerQuery = {
  customer: Customer
  cart: Cart
  paymentConfig: PaymentConfig
}

export declare type CtShippingInfo = {
  price?: {
    centAmount: number
    currencyCode: string
  }
  shippingMethodName: string
  discountedPrice?: {
    value: {
      centAmount: number
      currencyCode: string
    }
  }
}
