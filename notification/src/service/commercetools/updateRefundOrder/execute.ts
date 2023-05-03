import { ApiClient, Constants, getOrderById } from "@gr4vy-ct/common"
import { Order } from "@commercetools/platform-sdk"

import { updateRefundOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import { OrderUpdateForRefund, RefundMessageObject } from "./../../types"

const {
  STATES: { CT },
} = Constants

const updateRefundOrder = async (
  {
    orderUpdateForRefund,
  }: {
    orderUpdateForRefund: OrderUpdateForRefund
  },
  { refundData }: { refundData: RefundMessageObject }
): Promise<any> => {
  const findFor = "{repl}{/repl}"

  let updateRefunOrderMutationQuery = updateRefundOrderMutation

  refundData.items.forEach(value => {
    const replaceValue =
      "\n{" +
      "\nsetReturnPaymentState:{\n" +
      "paymentState:Refunded\n" +
      'returnItemId:"' +
      value.id +
      '"\n' +
      "}\n" +
      "}{repl}{/repl}"
    updateRefunOrderMutationQuery = updateRefunOrderMutationQuery.replace(findFor, replaceValue)
  })
  const orderId = orderUpdateForRefund.orderId
  const order = await getOrderById(orderId)
  if (order && isFullyRefundedOrder(order)) {
    const replaceValueForOrderState =
      "\n{" +
      "\nchangeOrderState:{\n" +
      "orderState:" +
      CT.ORDER.COMPLETE +
      "\n" +
      "}\n" +
      "}{repl}{/repl}"
    updateRefunOrderMutationQuery = updateRefunOrderMutationQuery.replace(
      findFor,
      replaceValueForOrderState
    )
  }
  updateRefunOrderMutationQuery = updateRefunOrderMutationQuery.replace(findFor, "")

  if (updateRefunOrderMutationQuery.length) {
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: updateRefunOrderMutationQuery,
      variables: {
        version: orderUpdateForRefund.version,
        orderId: orderUpdateForRefund.orderId,
      },
    })
    return await responseMapper(await apiClient.getData())
  }
  return {}
}
function isFullyRefundedOrder(order: Order): boolean {
  const totalLineItemsQty: { [key: string]: number } = {}
  order.lineItems.forEach(function (lineItem) {
    if (totalLineItemsQty[lineItem.id]) {
      totalLineItemsQty[lineItem.id] += lineItem.quantity
    } else {
      totalLineItemsQty[lineItem.id] = lineItem.quantity
    }
  })

  const totalReturnItemsQty: { [key: string]: number } = {}
  order.returnInfo?.forEach(returnInfo => {
    returnInfo.items.forEach(returnItem => {
      const returnlineItemId = (returnItem as { lineItemId: string }).lineItemId
      if (totalReturnItemsQty[returnlineItemId]) {
        totalReturnItemsQty[returnlineItemId] += returnItem.quantity
      } else {
        totalReturnItemsQty[returnlineItemId] = returnItem.quantity
      }
    })
  })

  for (const lineItemId in totalLineItemsQty) {
    const qtyOrdered = totalLineItemsQty[lineItemId]
    const qtyAlreadyReturned = totalReturnItemsQty[lineItemId] ?? 0
    if (qtyAlreadyReturned < qtyOrdered) {
      return false
    }
  }
  return true
}
export { updateRefundOrder }
