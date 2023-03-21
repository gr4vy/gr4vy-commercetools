// GraphQL query to update payment by adding the new transaction
const updatePaymentMutation = `
mutation (
    $paymentId:String!, 
    $paymentVersion:Long!, 
    $transactionType: TransactionType!,
    $refundAmount: Long!,
    $transactionCurrency: Currency!
    $interactionId: String
    $state: TransactionState
    $typeKey: String!
    $refundId: String!                                                                                                                                                                                                                                                                         
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

