// GraphQL query to get Customer
const updateCustomerMutation = `
mutation ($version:Long!, $customerId:String!, $buyerId: String!, $ctpCustomFieldNameForGr4vyBuyerId: String!){
  updateCustomer(
    version:$version,
    id:$customerId,
    actions:{
      setCustomField:{
        name:$ctpCustomFieldNameForGr4vyBuyerId,
        value:$buyerId
      }
    }
  ){
    id
  }
}
`

export { updateCustomerMutation }
