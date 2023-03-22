// GraphQL query to create custom fields
const createCustomFieldGr4vyBuyerId = `
  createCustomFieldGr4vyBuyerId: createTypeDefinition(    
    draft:{
      key: $buyerId
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

const createCustomFieldGr4vyRefundId = `
  createCustomFieldGr4vyRefundId: createTypeDefinition(    
    draft:{
      key: $refundId
      name:{
        locale: $locale
        value: $refundIdDescription
      }
      resourceTypeIds: $refundIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$refundIdName
        required:false
        label:{
          locale: $locale
          value: $refundIdLabel
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
  $buyerId:String!,
  $transactionId: String!,
  $refundId: String!,
  $locale: Locale!,
  $buyerIdName:String!,
  $transactionIdName:String!,
  $refundIdName:String!,
  $buyerIdLabel:String!,
  $transactionIdLabel:String!,
  $refundIdLabel:String!,
  $buyerIdDescription:String!,
  $transactionIdDescription:String!,
  $refundIdDescription:String!,
  $buyerIdResourceTypeIds:[String!]!,
  $transactionIdResourceTypeIds:[String!]!,
  $refundIdResourceTypeIds:[String!]!
  ){
  ${createCustomFieldGr4vyBuyerId},
  ${createCustomFieldGr4vyTransactionId},
  ${createCustomFieldGr4vyRefundId}
}
`
export {createCustomFieldsMutationQuery}
