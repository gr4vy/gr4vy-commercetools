export declare type PaymentConfig = {
  id: string
  key: string
  container: string
  value: { [key: string]: string }
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
