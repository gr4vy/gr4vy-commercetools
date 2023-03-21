// GraphQL query to add charge transaction in payments

const addTransactionVoid = `mutation (
$version: Long!, 
$paymentId: String!, 
$transactionId: String!, 
$timeStamp: DateTime!,
$amount: Long!,
$currencyCode: Currency!
) {
      updatePayment (
        version: $version
        id: $paymentId
        actions:[
          {
            addTransaction:{
              transaction:{
                timestamp:$timeStamp
                type:CancelAuthorization
                amount:{
                  centAmount:$amount
                  currencyCode:$currencyCode
                }
                interactionId:$transactionId
                state:Success
              }
            }
          }
        ]
      ){
        version
        id
      }
    }`
export { addTransactionVoid }
