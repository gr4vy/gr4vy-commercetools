import { ApiClient } from "../../../clients/apiClient"
import { updatePaymentMutation, updateRefundMutation } from "./query"
import { responseMapper } from "./mapper"
import { Order, RefundItem } from "./../../types"
import { Constants } from "./../../../config"
import { escapedJSON } from "./../../../utils"

const getRefundState = (refundItem: RefundItem): string => {
  let refundState = Constants.CT_REFUND_INITIAL
  if (refundItem.status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_SUCCEEDED) {
    refundState = Constants.GR4VY_REFUND_SUCCEEDED
  }

  if (refundItem.status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_DECLINED) {
    refundState = Constants.GR4VY_REFUND_DECLINED
  }
  if (refundItem.status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_FAILED) {
    refundState = Constants.GR4VY_REFUND_FAILED
  }
  if (refundItem.status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_VOIDED) {
    refundState = Constants.GR4VY_REFUND_VOIDED
  }
  if (refundItem.status === Constants.GR4VY_REFUND_STATUS.GR4VY_REFUND_PROCESSING) {
    refundState = Constants.GR4VY_REFUND_PROCESSING
  }

  return refundState
}

const addTransaction = async ({ order, refundItem }: { order: Order; refundItem: RefundItem }) => {
  const apiClient: ApiClient = new ApiClient()

  const [payment] = order?.paymentInfo?.payments || []

  const refundState = getRefundState(refundItem)

  apiClient.setBody({
    query: updatePaymentMutation,
    variables: {
      paymentId: payment?.id,
      paymentVersion: refundItem.paymentVersion,
      transactionType: Constants.CT_REFUND_TRANSACTION_TYPE,
      refundAmount: refundItem.amount,
      transactionCurrency: refundItem.currency,
      interactionId: Constants.PAYMENT_INTERACTION_ID,
      state: refundState,
      typeKey: Constants.CT_CUSTOM_FIELD_TRANSACTION_REFUND,
      refundId: escapedJSON(refundItem.id),
      timestamp: new Date().toISOString(),
    },
  })

  return responseMapper(await apiClient.getData())
}

const updateRefund = async ({
  order,
  refundItem,
  values,
}: {
  order: Order
  refundItem: RefundItem
  values: any
}) => {
  const apiClient: ApiClient = new ApiClient()

  const [payment] = order?.paymentInfo?.payments || []

  const refundState = getRefundState(values)

  if (values.ctStatus === refundState) {
    return false
  }

  apiClient.setBody({
    query: updateRefundMutation,
    variables: {
      paymentId: payment?.id,
      paymentVersion: refundItem.paymentVersion,
      state: refundState,
      timestamp: new Date().toISOString(),
      transactionId: values.transactionId,
    },
  })

  return responseMapper(await apiClient.getData())
}

export { addTransaction, updateRefund }
