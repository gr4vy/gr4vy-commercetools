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
  productId: string
  quantity: number
  unitAmount: number
  discountAmount: number | null
  taxAmount: number | null
  externalIdentifier: string | null
  sku: string | null
  imageUrl: string | null
  categories: string | null
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
  updateGr4vyReference: UpdateGr4vyReference
}

export declare type UpdateGr4vyReference = {
  customerVersion: string
  customerId: string
  gr4vyBuyerId: string
  orderVersion: string
  addressId: string
  ctCustomFieldNameAddressId: string
  addressDetailId: string
  orderId: string
  ctCustomFieldNameBuyerIdOrder: string
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
