import { Payment, Order } from "@commercetools/platform-sdk"

export const resolveOrderPayment = (order: Order): Payment => {
  const payments = (order?.paymentInfo?.payments || []) as unknown as Payment[]
  const sortedPayments = payments.sort((a, b) => {
    return new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
  })
  const [payment] = sortedPayments
  // return last modified payment
  return payment
}
