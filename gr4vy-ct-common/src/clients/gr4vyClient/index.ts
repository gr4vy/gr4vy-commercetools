import fs from "fs"

import { Client, BuyerRequest, TransactionCaptureRequest } from "@gr4vy/node"

import { Options, EmbedParams, BuyerParams, TransactionCaptureParams } from "./types"

export class Gr4vy {
  client: Client

  constructor({ gr4vyId, privateKey, environment }: Options) {
    privateKey = String(fs.readFileSync(process.env.GR4VY_PRIVATE_KEY_PATH + privateKey))

    this.client = new Client({
      gr4vyId,
      privateKey,
      environment: environment || "sandbox",
    })
  }

  getEmbedToken({ amount, currency, buyerExternalIdentifier, buyerId, metadata }: EmbedParams) {
    return this.client.getEmbedToken({
      amount,
      currency,
      buyerExternalIdentifier,
      buyerId,
      metadata,
    })
  }

  createBuyer({ displayName, externalIdentifier }: BuyerParams) {
    const buyerRequest = new BuyerRequest()
    buyerRequest.displayName = displayName
    buyerRequest.externalIdentifier = externalIdentifier
    return this.client.addBuyer(buyerRequest)
  }

  transactionCapture({ amount, transactionId }: TransactionCaptureParams) {
    const transactionCaptureRequest = new TransactionCaptureRequest()
    transactionCaptureRequest.amount = amount
    return this.client.captureTransaction(transactionId, transactionCaptureRequest)
  }

  getTransactionById(transactionId: string) {
    return this.client.getTransaction(transactionId)
  }
}
