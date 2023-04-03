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

const updateRefundMutation = `
mutation (
    $paymentId:String!, 
    $paymentVersion:Long!, 
    $transactionId: String!,
    $state: TransactionState!,
    $timestamp:DateTime!
){
  updatePayment(
    id:$paymentId,
    version: $paymentVersion,
    actions: [{
      changeTransactionState: {
        transactionId: $transactionId
        state: $state
      }
    },{
      changeTransactionTimestamp:{
        transactionId: $transactionId
        timestamp: $timestamp
      }
    }]
  ){
    id
  }
}
`

export { updatePaymentMutation, updateRefundMutation }
