// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { PaymentConfig, Refund } from "./../../types"

export const transactionRefund = async ({
  refund,
  paymentConfig,
}: {
  refund: Refund
  paymentConfig: PaymentConfig
}) => {
  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const transactionRefundParams = {
    amount: refund.amount,
    transactionId: refund.transactionId,
  }

  try {
    return await gr4vy.transactionRefund(transactionRefundParams)
  } catch (e) {
    throw new Error(
      "There happened  an error, while communicating with gr4vy API. Error Message - " + e.message
    )
  }
}
