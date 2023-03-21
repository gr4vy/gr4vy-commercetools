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
  transactions: Transaction[]
}

export declare type OrderCustomFieldsRaw = {
  name: string
  value: string
}

export declare type Order = {
  id: string
  version: string
  orderState: string
  paymentState: string
  paymentInfo: {
    payments: Payment[]
  }
  returnInfo: [
    {
      items: [
        {
          id: string
          quantity: number
          type: string
          paymentState: string
        }
      ]
    }
  ]

  totalPrice: {
    type: string
    centAmount: number
    fractionDigits: number
    currencyCode: string
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
      }
    }
  ]

  custom: {
    customFieldsRaw: OrderCustomFieldsRaw[]
  }
}

export declare type RefundItem = {
  type: string
  id: string
  transactionId: string
  status: string
  currency: string
  amount: string
  paymentVersion: string
}
