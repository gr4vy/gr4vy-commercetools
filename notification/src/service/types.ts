export declare type Delivery = {
  id: string
  quantity: number
}

export declare type OrderUpdate = {
  orderState: string
  paymentState: string
  version: string
  orderId: string
}

export declare type OrderUpdateForRefund = {
  version: string
  orderId: string
}

export declare type Capture = {
  amount: number
  transactionId: string
}

export declare type Refund = {
  amount: number
  transactionId: string
}

export declare type Void = {
  transactionId: string
}

export declare type PaymentConfig = {
  gr4vyId: string
  privateKey: string
  environment?: "production" | "sandbox"
  paymentSource?: "installment" | "moto" | "recurring"
  requiredSecurityCode?: string | null
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

export declare type TransactionCapture = {
  capture: Capture
  paymentConfig: PaymentConfig
}

export declare type TransactionRefund = {
  refund: Refund
  paymentConfig: PaymentConfig
}

export declare type TransactionVoid = {
  voidTxion: Void
  paymentConfig: PaymentConfig
}

export declare type TrasactionRefundResponse = {
  type: string
  id: string
  transaction_id: string
  status: string
  currency: string
  amount: number
  created_at: string
  updated_at: string
}

export declare type RefundMessageObject = {
  items: [
    {
      id: string
      lineItemId: string
      quantity: number
    }
  ]
}
