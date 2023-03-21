// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import { updateRefundOrderMutation } from "./query"
import { responseMapper } from "./mapper"
import {OrderUpdateForRefund, RefundMessageObject} from "./../../types"

const updateRefundOrder = async ({
  orderUpdateForRefund,
}: {
  orderUpdateForRefund: OrderUpdateForRefund
}, {refundData}: {refundData:RefundMessageObject}): Promise<boolean> => {
  const findFor = '{repl}{/repl}';

  let updateRefunOrderMutationQuery = updateRefundOrderMutation

  refundData.items.forEach(value => {
    let replaceValue = '\n{' +
        '\nsetReturnPaymentState:{\n' +
          'paymentState:Refunded\n' +
          'returnItemId:"'+value.id+'"\n' +
        '}\n' +
    '}{repl}{/repl}'
    updateRefunOrderMutationQuery = updateRefunOrderMutationQuery.replace(findFor, replaceValue)
  })
  updateRefunOrderMutationQuery = updateRefunOrderMutationQuery.replace(findFor, '')

  if (updateRefunOrderMutationQuery.length) {
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: updateRefunOrderMutationQuery,
      variables: {
        version: orderUpdateForRefund.version,
        orderId: orderUpdateForRefund.orderId
      },
    })
    return await responseMapper(await apiClient.getData())
  }
    return false
}

export { updateRefundOrder }
