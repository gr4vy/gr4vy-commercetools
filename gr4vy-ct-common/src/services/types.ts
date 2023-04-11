export declare type PaymentConfigContainer = {
  id: string
  key: string
  container: string
  value: string
}

export declare type PaymentConfig = {
  gr4vyId: string
  privateKey: string
  environment?: "production" | "sandbox"
  paymentSource?: "installment" | "moto" | "recurring"
  requiredSecurityCode?: string | null
  statementDescriptor?: StatementDescriptor
  theme: object
  intent?: "authorize" | "capture" | "approve"
  payment_type: string | null
  active: number | null
  debug?: boolean | null
  allowspecific: number | null //TBD: Change to string
  paymentStore?: "ask" | boolean
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

export declare type Transaction = {
  id: string
  type: string
  state: string
  amount: {
    currencyCode: string
    centAmount: number
  }
}

export declare type Payment = {
  id: string
  version: string
  interfaceId: string
  paymentMethodInfo: {
    paymentInterface: string
  }
  transactions: Transaction[]
}

export declare type OrderCustomFieldsRaw = {
  name: string
  value: string
}

export declare type discountedPricePerQuantity = {
  fullRefunded: boolean
  partiallyRefunded: boolean
  balanceQty: number
  quantity: number
  discountedPrice: {
    value: {
      centAmount: number
    }
  }
}

export declare type OrderReturnInfoItems = {
  id: string
  lineItemId: string
  quantity: number
  type: string
  paymentState: string
}

export declare type OrderReturnInfo = {
  items: OrderReturnInfoItems[]
}

export declare type Order = {
  id: string
  version: string
  orderState: string
  paymentState: string
  
  paymentInfo: {
    payments: Payment[]
  }
  returnInfo: OrderReturnInfo[]

  totalPrice: {
    type: string
    centAmount: number
    fractionDigits: number
    currencyCode: string
  }
  shippingInfo: {
    taxRate: {
      amount: number
      includedInPrice: boolean
    }
  }
  taxedShippingPrice: {
    totalTax: {
      centAmount: number
    }
  }
  taxedPrice: {
    taxPortions: [{
      rate: number
      amount: {
        centAmount: number
      }
    }]
    totalNet: {
      currencyCode: string
      centAmount: number
    }
    totalGross: {
      currencyCode: string
      centAmount: number
    }
  }

  lineItems: [
    {
      id: string
      productId: string
      quantity: number
      totalPrice: {
        centAmount: number
      }
      price: {
        value: {
          centAmount: number
        }
        discounted: {
          value: {
            centAmount: number
          }
        }
      }
      discountedPricePerQuantity:discountedPricePerQuantity[]
      taxRate: {
        includedInPrice: boolean
      }
      taxedPrice: {
        totalNet: {
          centAmount: number
        }
        totalGross: {
          centAmount: number
        }
      }
    }
  ]

  custom: {
    customFieldsRaw: OrderCustomFieldsRaw[]
  }
}

export declare type RefundItems = [RefundItem]

export declare type RefundItem = {
  type: string
  id: string
  transactionId: string
  status: string
  currency: string
  amount: string
  paymentVersion: string
}

export declare type Gr4vyTransactionResponse = {
  id: string
  paymentService: {
    method: string
    displayName: string
  }
  rawResponseCode: string | null
  rawResponseDescription: string | null
}

export declare type UpdateOrderWithPaymentResponse = {
  hasOrderWithPaymentUpdated: boolean
  updateOrder: { id: string; version: string }
  updatePayment: { id: string; version: string }
}
