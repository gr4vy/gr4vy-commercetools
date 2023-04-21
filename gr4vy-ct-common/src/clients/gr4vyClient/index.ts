import {
  Client,
  BuyerRequest,
  ShippingDetailRequest,
  TransactionCaptureRequest,
  TransactionRefundRequest,
} from "@gr4vy/node"
import Logger from "bunyan"

import { getLogger } from "../../utils"
import {
  Options,
  EmbedParams,
  BuyerParams,
  UpdateBuyerParams,
  UpdateBuyerShippingAddressParams,
  TransactionRefundParams,
  TransactionVoidParams,
  TransactionCaptureParams,
} from "./types"

export class Gr4vy {
  client: Client
  logger: Logger

  constructor({ gr4vyId, privateKey, environment, debug }: Options) {
    this.logger = getLogger()
    this.client = new Client({
      gr4vyId,
      privateKey,
      environment: environment || "sandbox",
      debug: debug || false,
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
    this.logger.debug("getEmbedToken", {
      amount,
      currency,
      buyerExternalIdentifier,
      buyerId,
      metadata,
      cartItems,
    })
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
    this.logger.debug("createBuyer", buyerRequest)
    return this.client.addBuyer(buyerRequest)
  }

  updateBuyer({
    displayName,
    externalIdentifier,
    billingDetails,
    gr4vyBuyerId,
  }: UpdateBuyerParams) {
    const buyerRequest = new BuyerRequest()
    buyerRequest.displayName = displayName
    buyerRequest.externalIdentifier = externalIdentifier
    buyerRequest.billingDetails = billingDetails
    this.logger.debug("updateBuyer", buyerRequest)
    return this.client.updateBuyer(gr4vyBuyerId, buyerRequest)
  }

  addBuyerShippingDetail({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    address,
    gr4vyBuyerId,
  }: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = firstName
    shippingRequest.lastName = lastName
    shippingRequest.emailAddress = emailAddress
    shippingRequest.phoneNumber = phoneNumber
    shippingRequest.address = address
    this.logger.debug("addBuyerShippingDetail", { gr4vyBuyerId, shippingRequest })
    return this.client.addBuyerShippingDetail(gr4vyBuyerId, shippingRequest)
  }

  updateBuyerShippingDetail({
    firstName,
    lastName,
    emailAddress,
    phoneNumber,
    address,
    gr4vyBuyerId,
    buyerShippingId,
  }: UpdateBuyerShippingAddressParams) {
    const shippingRequest = new ShippingDetailRequest()
    shippingRequest.firstName = firstName
    shippingRequest.lastName = lastName
    shippingRequest.emailAddress = emailAddress
    shippingRequest.phoneNumber = phoneNumber
    shippingRequest.address = address
    this.logger.debug("updateBuyerShippingDetail", { gr4vyBuyerId, buyerShippingId, shippingRequest })
    return this.client.updateBuyerShippingDetail(gr4vyBuyerId, buyerShippingId, shippingRequest)
  }

  transactionCapture({ amount, transactionId }: TransactionCaptureParams) {
    const transactionCaptureRequest = new TransactionCaptureRequest()
    transactionCaptureRequest.amount = amount
    this.logger.debug("transactionCapture", { transactionId, transactionCaptureRequest })
    return this.client.captureTransaction(transactionId, transactionCaptureRequest)
  }

  transactionRefund({ amount, transactionId }: TransactionRefundParams) {
    const transactionRefundRequest = new TransactionRefundRequest()
    transactionRefundRequest.amount = amount
    this.logger.debug("transactionRefund", { transactionId, transactionRefundRequest })
    return this.client.refundTransaction(transactionId, transactionRefundRequest)
  }

  transactionVoid({ transactionId }: TransactionVoidParams) {
    this.logger.debug("transactionVoid", transactionId)
    return this.client.voidTransaction(transactionId)
  }

  getTransactionById(transactionId: string) {
    this.logger.debug("getTransactionById", transactionId)
    return this.client.getTransaction(transactionId)
  }

  listTransactionRefunds(transactionId: string) {
    this.logger.debug("listTransactionRefunds", transactionId)
    return this.client.listTransactionRefunds(transactionId)
  }

  listBuyer(userId: string) {
    this.logger.debug("listBuyer", userId)
    const result = this.client.listBuyers(userId, 1)
    return result
  }

  listTransaction(orderId: string) {
    this.logger.debug("listTransaction", orderId);
    const result = this.client.listTransactions(undefined, undefined, undefined, 1, undefined, undefined, undefined, undefined, undefined, undefined, orderId)
    return result;
  }
}
