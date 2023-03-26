import { ApiClient } from "../../../clients/apiClient"
import { updatePaymentMutation } from "./query"
import { responseMapper } from "./mapper"
import { Order, RefundItem } from "./../../types"
import { Constants } from "./../../../config"
import { escapedJSON } from "./../../../utils"

const addTransaction = async ({
  order,
  refundItem
}: {
  order: Order,
  refundItem: RefundItem
}) => {
  const apiClient: ApiClient = new ApiClient()

  const [payment] = order?.paymentInfo?.payments || []

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

  const hhh = {
    payments:[{
      paymentId:""
    },{
      paymentId:""
    }]
  }

  const variableObject =
    {
      paymentId: "84876d97-e1c4-494a-87bd-c31bddd9a9df",
      paymentVersion: "4",
      transactionType: Constants.CT_REFUND_TRANSACTION_TYPE,
      refundAmount: "10",
      transactionCurrency: "EUR",
      interactionId: Constants.PAYMENT_INTERACTION_ID,
      state: refundState,
      typeKey: Constants.CT_CUSTOM_FIELD_TRANSACTION_REFUND,
      refundId: escapedJSON("twst-test-test")
    }



  /*apiClient.setBody({
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
      refundId: escapedJSON(refundItem.id)
    },
  })*/

  apiClient.setBody({
    query: updatePaymentMutation,
    variables: hhh
  })

console.log('refundState')
  console.log(refundState)
  return 'success'
  //return responseMapper(await apiClient.getData())
}

export { addTransaction }
