const updateRefundOrderMutation = `mutation ($version: Long!, $orderId: String!) {
      updateOrder(
        id:$orderId
        version:$version
        actions:[
            {repl}{/repl}
        ]
      ){
        id
        version
      }
    }`
export { updateRefundOrderMutation }
