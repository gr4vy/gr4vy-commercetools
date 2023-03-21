
const updateOrderMutation = `
mutation (
  $version: Long!,
  $orderId: String!,
  $customFieldKey:String!,
  $customFieldName:String!,
  $gr4vyTransactionId: String!,
  $type: String!
) {
  updateOrder(
    id:$orderId
    version:$version
    actions:[{      
      setCustomType:{
        type: {
          key: $customFieldKey
          typeId:$type
        }
        fields:{
          name:$customFieldName
          value:$gr4vyTransactionId
        }
      }
    }]
  ){
    id
    version
  }
}
`

export { updateOrderMutation }