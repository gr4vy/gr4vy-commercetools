export declare type PaymentConfig = {
  id: string
  key: string
  container: string
  value: { [key: string]: string }
}

export declare type PaymentConfigValue = {
  gr4vyId: string
  privateKey: string
  environment: string
  paymentSource: string | null
  requiredSecurityCode: string | null
  statementDescriptor: {
    name: string | null
    description: string | null
    city: string | null
    phonenumber: string | null
    url: string | null
  }
  theme: object
  intent: string
  payment_type: string | null
  active: number | null
  debug: number | null
  allowspecific: number | null //TBD: Change to string
  paymentStore: string | null
}

export declare type Transaction = {
  id: string
  type: string
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

export declare type Order = {
  id: string
  version: string
  paymentInfo: {
    payments: Payment[]
  }
}
