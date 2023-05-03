import { Order, DiscountedLineItemPriceForQuantity } from "@commercetools/platform-sdk"
export interface OrderMainInterface{
  orderId: string
  version: number
  paymentVersion: number
  currencyCode: string | undefined
  paymentId: string
  paymentTransactionId: string | null | undefined
}

export interface CaptureOrderDetailsInterface extends OrderMainInterface {
  totalAmount: number | undefined
}

export interface OrderRefundDetailsInterface extends OrderMainInterface {
  refundAmount: number
}

export interface OrderVoidDetailsInterface extends OrderMainInterface {
  orderState: string
  voidAmount: number | undefined
  currencyCode: string | undefined
}

export interface DiscountedLineItemPriceForQuantityCT extends DiscountedLineItemPriceForQuantity {
  balanceQty: number
  quantity: number
}
