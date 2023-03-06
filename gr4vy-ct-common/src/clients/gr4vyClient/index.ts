import fs from "fs"

import { Client, BuyerRequest, ShippingDetailRequest, TransactionCaptureRequest } from "@gr4vy/node"

import { getLogger } from "../../utils"
import {
  Options,
  EmbedParams,
  BuyerParams,
  UpdateBuyerParams,
  UpdateBuyerShippingAddressParams,
  TransactionCaptureParams
} from "./types"

const logger = getLogger();

export class Gr4vy {
  client: Client

  constructor({ gr4vyId, privateKey, environment }: Options) {
    privateKey = String(fs.readFileSync(process.env.GR4VY_PRIVATE_KEY_PATH + privateKey))

    this.client = new Client({
      gr4vyId,
      privateKey,
      environment: environment || "sandbox",
      debug: true,
    })
  }

  getEmbedToken({
    amount,
    currency,
    buyerExternalIdentifier,
    buyerId,
    metadata,
    cartItems,
  }: EmbedParams) {
    logger.debug("getEmbedToken", {
      amount,
    currency,
    buyerExternalIdentifier,
    buyerId,
    metadata,
    cartItems,
    });
    return this.client.getEmbedToken({
      amount,
      currency,
      buyerExternalIdentifier,
      buyerId,
      metadata,
      cartItems,
    })
  }

  async createBuyer({ displayName, externalIdentifier }: BuyerParams) {
    const buyerRequest = new BuyerRequest()
    buyerRequest.displayName = displayName
    buyerRequest.externalIdentifier = externalIdentifier
    logger.debug("createBuyer", buyerRequest)
    return this.client.addBuyer(buyerRequest)
  }

  updateBuyer({ displayName, externalIdentifier, billingDetails, gr4vyBuyerId }: UpdateBuyerParams) {
    const buyerRequest = new BuyerRequest()
    buyerRequest.displayName = displayName;
    buyerRequest.externalIdentifier = externalIdentifier
    buyerRequest.billingDetails = billingDetails
    logger.debug("updateBuyer", buyerRequest)
    return this.client.updateBuyer(gr4vyBuyerId, buyerRequest)
  }

  addBuyerShippingDetail({firstName, lastName, emailAddress, phoneNumber, address,gr4vyBuyerId}: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = firstName
    shippingRequest.lastName = lastName
    shippingRequest.emailAddress = emailAddress
    shippingRequest.phoneNumber = phoneNumber
    shippingRequest.address = address
    logger.debug("addBuyerShippingDetail", {gr4vyBuyerId, shippingRequest})
    return this.client.addBuyerShippingDetail(gr4vyBuyerId, shippingRequest)
  }

  updateBuyerShippingDetail({firstName, lastName, emailAddress, phoneNumber, address,gr4vyBuyerId,buyerShippingId}: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = firstName
    shippingRequest.lastName = lastName
    shippingRequest.emailAddress = emailAddress
    shippingRequest.phoneNumber = phoneNumber
    shippingRequest.address = address
    logger.debug("updateBuyerShippingDetail", {gr4vyBuyerId, buyerShippingId, shippingRequest})
    return this.client.updateBuyerShippingDetail(gr4vyBuyerId, buyerShippingId, shippingRequest)
  }

  transactionCapture({ amount, transactionId }: TransactionCaptureParams) {
    const transactionCaptureRequest = new TransactionCaptureRequest()
    transactionCaptureRequest.amount = amount
    logger.debug("transactionCapture", {transactionId, transactionCaptureRequest})
    return this.client.captureTransaction(transactionId, transactionCaptureRequest)
  }

  getTransactionById(transactionId: string) {
    logger.debug("getTransactionById", transactionId)
    return this.client.getTransaction(transactionId)
  }

  listBuyer(userId: string) {
    logger.debug("listBuyer", userId);
    const result = this.client.listBuyers(userId, 1)
    return result;
  }
}
