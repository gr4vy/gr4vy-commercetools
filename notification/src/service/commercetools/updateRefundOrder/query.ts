// GraphQL query to get Customer

const updateRefundOrderMutation = `mutation ($version: Long!, $orderId: String!) {
      updateOrder(
        id:$orderId
        version:$version
        actions:[
            {repl}{/repl}
        ]
      ){
        id
      }
    }`
export { updateRefundOrderMutation }
