export interface OrderMainInterface {
  orderId: string
  version: string
  paymentVersion: number
  currencyCode: string
  paymentId: string
  paymentTransactionId: string
}
export interface CaptureOrderDetailsInterface extends OrderMainInterface {
  totalAmount: number
}

export interface OrderRefundDetailsInterface extends OrderMainInterface {
  refundAmount: number
}

export interface OrderVoidDetailsInterface extends OrderMainInterface {
  orderState: string
  voidAmount: number
  currencyCode: string
}
