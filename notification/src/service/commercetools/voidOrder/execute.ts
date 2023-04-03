// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, ApiClient, Constants, getTransactionById } from "@gr4vy-ct/common"

import { transactionVoid } from "./../../../service"
import { addTransactionVoid } from "./query"
import { responseMapper } from "./mapper"
import { OrderVoidDetailsInterface } from "./../../../model/order/interfaces"

const voidOrder = async (orderVoidDetails: OrderVoidDetailsInterface) => {
  const {
    STATES: { GR4VY },
  } = Constants

  const gr4vyTransactionId = orderVoidDetails.paymentTransactionId
  const voidTxion = { transactionId: gr4vyTransactionId }
  const paymentConfig = await getCustomObjects()

  // Get gr4vy transaction by ID
  const gr4vyTransaction = await getTransactionById(gr4vyTransactionId)

  if (!gr4vyTransaction) {
    throw {
      message: `Error in fetching gr4vy transaction for ID ${gr4vyTransactionId}`,
      statusCode: 400,
    }
  }

  const gr4vyTransactionStatus = gr4vyTransaction?.body?.status

  if (gr4vyTransactionStatus !== GR4VY.TRANSACTION.AUTHORIZATION_SUCCEEDED) {
    throw {
      message: `The transaction ${gr4vyTransactionId} is not voidable. Current status - ${gr4vyTransactionStatus}`,
      statusCode: 400,
    }
  }

  const { body: transactionVoidResponse } = await transactionVoid({ voidTxion, paymentConfig })

  if (
    transactionVoidResponse &&
    transactionVoidResponse.status == GR4VY.TRANSACTION.AUTHORIZATION_VOIDED
  ) {
    const { createdAt: transactionDate } = transactionVoidResponse
    const apiClient: ApiClient = new ApiClient()
    apiClient.setBody({
      query: addTransactionVoid,
      variables: {
        version: orderVoidDetails.paymentVersion,
        paymentId: orderVoidDetails.paymentId,
        amount: orderVoidDetails.voidAmount,
        currencyCode: orderVoidDetails.currencyCode,
        transactionId: orderVoidDetails.paymentTransactionId,
        timeStamp: transactionDate,
      },
    })
    return await responseMapper(await apiClient.getData())
  }
  return false
}
export { voidOrder }
