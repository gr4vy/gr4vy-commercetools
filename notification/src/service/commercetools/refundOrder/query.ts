// GraphQL query to add charge transaction in payments

const addTransactionRefund = `mutation (
$version: Long!, 
$paymentId: String!, 
$amount: Long!, 
$transactionId: String!, 
$currencyCode: Currency!,
$timeStamp: DateTime!
) {
      updatePayment (
        version: $version
        id: $paymentId
        actions:[
          {
            addTransaction:{
              transaction:{
                timestamp:$timeStamp
                type:Refund
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
export { addTransactionRefund }
