// GraphQL query to update payment by adding the new transaction
const updatePaymentMutation = `
mutation (
    $paymentId:String!, 
    $paymentVersion:Long!, 
    $transactionType: TransactionType!,
    $amount: Long!,
    $currency: Currency!
    $interactionId: String
    $state: TransactionState
    $typeKey: String!
    $customValue: String!
    $timestamp:DateTime!
){
  updatePayment(
    id:$paymentId,
    version: $paymentVersion,
    actions: {
      addTransaction: {
        transaction: {
          timestamp: $timestamp
          type: $transactionType
          amount: {
            centAmount: $amount
            currencyCode: $currency
          }   
          interactionId: $interactionId
          state: $state
          custom: {
            typeKey: $typeKey
            fields: {
              name: $typeKey
              value: $customValue
            }
          }
        }
      }
    }
  ){
    id
    version
  }
}
`

export { updatePaymentMutation }
