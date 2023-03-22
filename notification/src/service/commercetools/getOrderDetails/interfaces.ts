export interface OrderMainInterface {
  orderId: string
  version: string
  paymentVersion: number
  currencyCode: string
  paymentId: string
  paymentTransactionId: string
}
export interface OrderDetailsInterface extends OrderMainInterface {
  totalAmount: number
}

export interface OrderRefundDetailsInterface extends OrderMainInterface {
  refundAmount: number
}

export interface OrderVoidDetailsInterface extends OrderMainInterface {
  voidAmount: number
  currencyCode: string
}
