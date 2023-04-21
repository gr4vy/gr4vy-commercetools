import { ApiClient } from "../../../clients/apiClient"
import { updatePaymentMutation } from "./query"
import { responseMapper } from "./mapper"
import { Order } from "./../../types"
import { Constants } from "./../../../config"
import { escapedJSON } from "./../../../utils"
import { resolveOrderPayment } from "../../../helpers"

const getRefundState = (status: string): string => {
  let refundState = Constants.CT_REFUND_INITIAL
  if (status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_SUCCEEDED) {
    refundState = Constants.GR4VY_REFUND_SUCCEEDED
  }

  if (status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_DECLINED) {
    refundState = Constants.GR4VY_REFUND_DECLINED
  }
  if (status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_FAILED) {
    refundState = Constants.GR4VY_REFUND_FAILED
  }
  if (status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_VOIDED) {
    refundState = Constants.GR4VY_REFUND_VOIDED
  }
  if (status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_PROCESSING) {
    refundState = Constants.GR4VY_REFUND_PROCESSING
  }

  return refundState
}

const getState = (status: string): string => {
  const states = Constants.STATES.CT.TRANSACTION

  let state = Constants.STATES.CT.TRANSACTION.INITIAL

  if (status === states.FAILURE) {
    state = states.FAILURE
  }

  if (status === states.SUCCESS) {
    state = states.SUCCESS
  }

  if (status === states.PENDING) {
    state = states.PENDING
  }

  return state
}

const addTransaction = async ({
  isRefund,
  order,
  status,
  paymentVersion,
  transactionType,
  amount,
  currency,
  customValue,
}: {
  isRefund: boolean
  order: Order
  status: string
  paymentVersion: number
  transactionType: string
  amount: number
  currency: string
  customValue: string
}) => {
  const apiClient: ApiClient = new ApiClient()

  const payment = resolveOrderPayment(order)

  const state = isRefund ? getRefundState(status) : getState(status)

  const typeKey = isRefund
    ? Constants.CT_CUSTOM_FIELD_TRANSACTION_REFUND
    : Constants.STATES.CT.CUSTOM_FIELDS.GR4VY_TRANSACTION_ID.NAME
  const interactionId = Constants.PAYMENT_INTERACTION_ID

  apiClient.setBody({
    query: updatePaymentMutation,
    variables: {
      paymentId: payment?.id,
      paymentVersion,
      transactionType,
      amount,
      currency,
      interactionId,
      state,
      typeKey,
      customValue: escapedJSON(customValue),
      timestamp: new Date().toISOString(),
    },
  })

  return responseMapper(await apiClient.getData())
}

export { addTransaction }
