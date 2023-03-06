
const updateCart = `
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
`

const updateCartMutation = `
mutation (
  $cartVersion:Long!,
  $cartId:String!,
  $ctpCustFieldOrderKey: String!,
  $ctpCustFieldType: String!,
  $ctpCustFieldName: String!
  $buyerId: String!,
) {
  ${updateCart}
}
`

export { updateCartMutation }