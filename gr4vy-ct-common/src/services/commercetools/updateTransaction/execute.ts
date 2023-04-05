import { Payment, Transaction, TransactionState } from "@commercetools/platform-sdk"

import { ApiClient } from "../../../clients/apiClient"
import { mutation } from "./mutation"
import { responseMapper } from "./mapper"

const updateTransaction = async ({
  payment,
  paymentVersion,
  transaction,
  transactionState,
}: {
  payment: Payment
  paymentVersion: number
  transaction: Transaction
  transactionState: TransactionState
}) => {
  const apiClient: ApiClient = new ApiClient()

  apiClient.setBody({
    query: mutation,
    variables: {
      paymentId: payment.id,
      version: paymentVersion,
      transactionId: transaction.id,
      state: transactionState,
      timestamp: new Date().toISOString(),
    },
  })

  return responseMapper(await apiClient.getData())
}

export { updateTransaction }
