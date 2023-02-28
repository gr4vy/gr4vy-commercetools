import fs from "fs"

import { Client, BuyerRequest, ShippingDetailRequest, TransactionCaptureRequest } from "@gr4vy/node"

import {
  Options,
  EmbedParams,
  BuyerParams,
  UpdateBuyerParams,
  ParamGr4vyBuyerId,
  UpdateBuyerShippingAddressParams,
  TransactionCaptureParams
} from "./types"

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

  updateBuyer({ display_name, external_identifier, billing_details }: UpdateBuyerParams, {gr4vyBuyerId}: ParamGr4vyBuyerId) {
    const buyerRequest = new BuyerRequest()
    buyerRequest.displayName = display_name;
    buyerRequest.externalIdentifier = external_identifier
    buyerRequest.billingDetails = billing_details
    return this.client.updateBuyer(gr4vyBuyerId, buyerRequest)
  }

  addBuyerShippingDetail({first_name, last_name, email_address, phone_number, address,buyerId}: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = first_name
    shippingRequest.lastName = last_name
    shippingRequest.emailAddress = email_address
    shippingRequest.phoneNumber = phone_number
    shippingRequest.address = address
    return this.client.addBuyerShippingDetail(buyerId, shippingRequest)
  }

  updateBuyerShippingDetail({first_name, last_name, email_address, phone_number, address,buyerId, buyerShippingId}: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = first_name
    shippingRequest.lastName = last_name
    shippingRequest.emailAddress = email_address
    shippingRequest.phoneNumber = phone_number
    shippingRequest.address = address
    return this.client.updateBuyerShippingDetail(buyerId, buyerShippingId, shippingRequest)
  }

  transactionCapture({amount, transactionId}: TransactionCaptureParams) {
    const transactionCaptureRequest = new TransactionCaptureRequest()
    transactionCaptureRequest.amount = amount
    return this.client.captureTransaction(transactionId, transactionCaptureRequest)
  }
}
