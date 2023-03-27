// GraphQL query to update payment by adding the new transaction

export const prepareTransactionQuery = (index: number, variable: any) => {
  const query = `addTransaction${index}: updatePayment(
    id: ${variable.paymentId},
    version: ${variable.paymentVersion},
    actions: {
      addTransaction: {
        transaction: {
          type: ${variable.transactionType}
          amount: {
            centAmount: ${variable.refundAmount}
            currencyCode: ${variable.transactionCurrency}
          }   
          interactionId: ${variable.interactionId}
          state: ${variable.state}
          custom: {
            typeKey: ${variable.typeKey}
            fields: {
              name: ${variable.typeKey}
              value: ${variable.refundId}
            }
          }
        }
      }
    }
  ){
    id
  }`
  return query
}

const getMutationQuery = (transactionQueries: string) => {
  const updatePaymentMutation = `
  mutation {
    ${transactionQueries}
  }
  `
  return updatePaymentMutation
}

export { getMutationQuery }
