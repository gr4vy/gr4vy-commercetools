import fs from "fs"

import { Client, BuyerRequest } from "@gr4vy/node"

import { Options, EmbedParams, BuyerParams } from "./types"

export class Gr4vy {
  client: Client

  constructor({ gr4vyId, privateKey, environment }: Options) {

    privateKey = String(fs.readFileSync(privateKey));

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
}
