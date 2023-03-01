// GraphQL query to update Customer address id in customer address and buyer id in order
const updateCustomerOrderMutation = `
mutation (
    $version:Long!, 
    $customerId:String!, 
    $ctCustomFieldNameForGr4vyBuyerAddressId: String!,
    $addressDetailId: String!,
    $addressId: String!
){
  updateCustomer(
    version:$version,
    id:$customerId,
    actions:{
      setAddressCustomField:{
        name:$ctCustomFieldNameForGr4vyBuyerAddressId,
        value:$addressDetailId
        addressId:$addressId
      }
    }
  ){
    id
  }
}
`

export { updateCustomerOrderMutation }
