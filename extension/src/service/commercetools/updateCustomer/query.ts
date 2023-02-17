// GraphQL query to get Customer
const updateCustomerMutation = `
mutation ($version:Long!, $customerId:String!, $buyerId: String!){
    updateCustomer(
      version:$version,
      id:$customerId,
      actions:{
        setExternalId:{
          externalId:$buyerId
        },
      }
    ){
      id
    }
  }
`

export { updateCustomerMutation }
