// GraphQL query to get Customer


const changePaymentState = `
  changePaymentState: updateOrder(
    id:$orderId,
    version: $orderPaymentVersion,
    actions: {
      changePaymentState: {
        paymentState: $orderPaymentState
      }
    }
  ) {
    id
  }`

const changeOrderState = `
  changeOrderState: updateOrder(
    id:$orderId,
    version: $orderVersion,
    actions: {
      changeOrderState: {
        orderState: $orderState
      }
    }
  ) {
    id
  }
`



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
      }
    }`
export { updateOrderMutation }
