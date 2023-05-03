import { Gr4vy } from "@gr4vy-ct/common"

import { PaymentConfig, Void } from "./../../types"

export const transactionVoid = async ({
  voidTxion,
  paymentConfig,
}: {
  voidTxion: Void
  paymentConfig: PaymentConfig
}) => {
  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const transactionVoidParams = {
    transactionId: voidTxion.transactionId,
  }

  try {
    return await gr4vy.transactionVoid(transactionVoidParams)
  } catch (e) {
    // <-- note `e` has explicit `unknown` type
    throw new Error(
      "There happened  an error, while communicating with gr4vy API. Error Message - " + e.message
    )
  }
}
