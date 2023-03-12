// GraphQL query to update Customer and Cart
const updateCustomerMutation = `
    mutation (
      $buyerId: String!,
      $ctpCustFieldName: String!
      $ctpCustFieldType: String!,
      $customerVersion:Long!,
      $ctpCustFieldCustomerKey: String!,
      $cartId:String!,
      $cartVersion:Long!,
      $ctpCustFieldOrderKey: String!,
    ){
      updateMyCustomer(
        version:$customerVersion,
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
      updateMyCart(
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
