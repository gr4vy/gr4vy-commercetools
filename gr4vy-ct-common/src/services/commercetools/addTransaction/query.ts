// GraphQL query to update payment by adding the new transaction
const updatePaymentMutation = `
mutation (
    $variableObject                                                                                                                                                                                                                                                                   
){
  updatePayment(
    id:$paymentId,
    version: $paymentVersion,
    actions: {
      addTransaction: {
        transaction: {
          type: $transactionType
          amount: {
            centAmount: $refundAmount
            currencyCode: $transactionCurrency
          }   
          interactionId: $interactionId
          state: $state
          custom: {
            typeKey: $typeKey
            fields: {
              name: $typeKey
              value: $refundId
            }
          }
        }
      }
    }
  ){
    id
  }
}
`

export { updatePaymentMutation }

