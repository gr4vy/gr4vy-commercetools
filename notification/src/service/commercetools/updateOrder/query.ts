// GraphQL query to update order
const updateOrderMutation = `mutation ($version: Long!, $orderId: String!) {
      updateOrder(
        id:$orderId
        version:$version
        actions:[{
            changeOrderState:{
               {repl}orderState:{/repl}
            }
        },{
            changePaymentState:{
               {repl}paymentState:{/repl}
            }
        }]
      ){
        id
        version
      }
    }`
export { updateOrderMutation }
