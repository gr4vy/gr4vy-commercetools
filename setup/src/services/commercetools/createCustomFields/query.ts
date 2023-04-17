// GraphQL query to create custom fields

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

const createCustomFieldGr4vyTransactionResponse = `
  createCustomFieldGr4vyTransactionResponse: createTypeDefinition(
    draft:{
      key: $responseId
      name:{
        locale: $locale
        value: $responseIdDescription
      }
      resourceTypeIds: $responseIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$responseIdName
        required:false
        label:{
          locale: $locale
          value: $responseIdLabel
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
  $transactionId: String!,
  $refundId: String!,
  $responseId: String!,
  $locale: Locale!,
  $transactionIdName:String!,
  $refundIdName:String!,
  $responseIdName:String!,
  $transactionIdLabel:String!,
  $refundIdLabel:String!,
  $responseIdLabel:String!,
  $transactionIdDescription:String!,
  $refundIdDescription:String!,
  $responseIdDescription:String!,
  $transactionIdResourceTypeIds:[String!]!,
  $refundIdResourceTypeIds:[String!]!,
  $responseIdResourceTypeIds:[String!]!
  ){
  ${createCustomFieldGr4vyTransactionId},
  ${createCustomFieldGr4vyRefundId},
  ${createCustomFieldGr4vyTransactionResponse},
}
`
export {createCustomFieldsMutationQuery}
