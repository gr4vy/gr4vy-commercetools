// GraphQL query to create custom fields
const createCustomFieldGr4vyBuyerId = `
  createCustomFieldGr4vyBuyerId: createTypeDefinition(    
    draft:{
      key: $buyerIdKey
      name:{
        locale: $locale
        value: $buyerIdDescription
      }
      resourceTypeIds: $buyerIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$buyerIdName
        required:false
        label:{
          locale: $locale
          value: $buyerIdLabel
        }
        inputHint:SingleLine      
      }
    }
  ){
    id
    version
  }
`
const createCustomFieldGr4vyTransactionId = `
  createCustomFieldGr4vyTransactionId: createTypeDefinition(    
    draft:{
      key: $txionIdKey
      name:{
        locale: $locale
        value: $txionIdDescription
      }
      resourceTypeIds: $txionIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$txionIdName
        required:false
        label:{
          locale: $locale
          value: $txionIdLabel
        }
        inputHint:SingleLine      
      }
    }
  ){
    id
    version
  }
`

const createCustomFieldsMutationQuery = `
mutation createCustomField (
  $buyerIdKey:String!,
  $txionIdKey: String!
  $locale: Locale!,
  $buyerIdName:String!,
  $txionIdName:String!,
  $buyerIdLabel:String!,
  $txionIdLabel:String!,
  $buyerIdDescription:String!,
  $txionIdDescription:String!,
  $buyerIdResourceTypeIds:[String!]!,
  $txionIdResourceTypeIds:[String!]!){
  ${createCustomFieldGr4vyBuyerId},
  ${createCustomFieldGr4vyTransactionId}
}
`
export {createCustomFieldsMutationQuery}
