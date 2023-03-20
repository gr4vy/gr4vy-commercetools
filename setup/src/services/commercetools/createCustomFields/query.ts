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
      key: $transactionId
      name:{
        locale: $locale
        value: $transactionIdDescription
      }
      resourceTypeIds: $transactionIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$transactionIdName
        required:false
        label:{
          locale: $locale
          value: $transactionIdLabel
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
  $transactionId: String!,
  $locale: Locale!,
  $buyerIdName:String!,
  $transactionIdName:String!,
  $buyerIdLabel:String!,
  $transactionIdLabel:String!,
  $buyerIdDescription:String!,
  $transactionIdDescription:String!,
  $buyerIdResourceTypeIds:[String!]!,
  $transactionIdResourceTypeIds:[String!]!){
  ${createCustomFieldGr4vyBuyerId},
  ${createCustomFieldGr4vyTransactionId}
}
`
export {createCustomFieldsMutationQuery}
