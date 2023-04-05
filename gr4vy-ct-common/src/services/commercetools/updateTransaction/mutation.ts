export const mutation = `
mutation (
    $paymentId:String!, 
    $version:Long!, 
    $transactionId: String!,
    $state: TransactionState!,
    $timestamp:DateTime!
){
  updatePayment(
    id: $paymentId,
    version: $version,
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
    version
  }
}
`
