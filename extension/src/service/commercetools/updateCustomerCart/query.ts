// GraphQL query to update Customer and Cart
const updateCustomerMutation = `
    mutation (
      $buyerId: String!,
      $ctpCustFieldName: String!
      $ctpCustFieldType: String!,
      $customerId:String!,
      $customerVersion:Long!,
      $ctpCustFieldCustomerKey: String!,
      $cartId:String!,
      $cartVersion:Long!,
      $ctpCustFieldOrderKey: String!,
    ){
      updateCustomer(
        version:$customerVersion,
        id:$customerId,
        actions:{
          setCustomType: {
            type: {
                key: $ctpCustFieldCustomerKey
                typeId: $ctpCustFieldType
            }
            fields: {
                name: $ctpCustFieldName
                value: $buyerId
            }
          }
        }
      ){
        id
      }
      updateCart(
        version:$cartVersion,
        id:$cartId,
        actions:{
          setCustomType:{
            type: {
                key: $ctpCustFieldOrderKey
                typeId: $ctpCustFieldType
            }
            fields:{
              name:$ctpCustFieldName,
              value: $buyerId
            }
          }
        }
      ){
        id
      }
    }
`


export { updateCustomerMutation }
