// GraphQL query to replicate cart from order
const replicateCartFromOrderQuery = `
mutation replicateCartFromOrder($orderId: String!){
  replicateCart(    
    reference:{
      typeId:"order"
      id:$orderId
    }
  ){
    id
  }
}
`
export { replicateCartFromOrderQuery }
