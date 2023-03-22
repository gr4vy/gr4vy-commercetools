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
  custom: {
    customFieldsRaw?: {
      name: string
      value: string
    }
  }
}

export declare type PaymentConfig = {
  gr4vyId: string
  privateKey: string
  environment?: 'production' | 'sandbox'
  paymentSource?: 'installment' | 'moto' | 'recurring'
  requiredSecurityCode?: string | null
  statementDescriptor?: StatementDescriptor
  theme: object
  intent?: 'authorize' | 'capture' | 'approve'
  payment_type: string | null
  active: number | null
  debug?: boolean | null
  allowspecific: number | null //TBD: Change to string
  paymentStore?: 'ask' | boolean
  metadata?: Record<string, string>
  customData?: string | null
}

export type StatementDescriptor = {
  name?: string
  description?: string
  city?: string
  phoneNumber?: string
  url?: string
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
    discounted: {
      value: {
        centAmount: number
      }
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
  productId?: string
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
  additionalStreetInfo?: string
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
  customer: Customer | null
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
