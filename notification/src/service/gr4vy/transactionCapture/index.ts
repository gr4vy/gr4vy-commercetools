// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import {TransactionCapture, PaymentConfig, Capture} from "./../../types"

export const transactionCapture = async ({ capture, paymentConfig } : {capture:Capture, paymentConfig:PaymentConfig}) => {
  const { gr4vyId, privateKey } = paymentConfig || {}
  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const transactionCaptureParams = {
    amount: capture.amount, transactionId: capture.transactionId
  }
  try {
    return await gr4vy.transactionCapture(transactionCaptureParams)
  } catch (e) {
    throw new Error('There happened  an error, while communicating with gr4vy API. Error Message - ' + e.message)
  }
}