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

const createCustomFieldCustomerGr4vyBuyerId = `
  createCustomFieldCustomerGr4vyBuyerId: createTypeDefinition(
    draft:{
      key: $customerBuyerId
      name:{
        locale: $locale
        value: $customerBuyerIdDescription
      }
      resourceTypeIds: $customerBuyerIdResourceTypeIds
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$customerBuyerIdName
        required:false
        label:{
          locale: $locale
          value: $customerBuyerIdLabel
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
  $buyerId:String!,
  $customerBuyerId:String!,
  $transactionId: String!,
  $refundId: String!,
  $responseId: String!,
  $locale: Locale!,
  $buyerIdName:String!,
  $customerBuyerIdName:String!,
  $transactionIdName:String!,
  $refundIdName:String!,
  $responseIdName:String!,
  $buyerIdLabel:String!,
  $customerBuyerIdLabel:String!,
  $transactionIdLabel:String!,
  $refundIdLabel:String!,
  $responseIdLabel:String!,
  $buyerIdDescription:String!,
  $customerBuyerIdDescription:String!,
  $transactionIdDescription:String!,
  $refundIdDescription:String!,
  $responseIdDescription:String!,
  $buyerIdResourceTypeIds:[String!]!,
  $customerBuyerIdResourceTypeIds:[String!]!,
  $transactionIdResourceTypeIds:[String!]!,
  $refundIdResourceTypeIds:[String!]!,
  $responseIdResourceTypeIds:[String!]!
  ){
  ${createCustomFieldGr4vyBuyerId},
  ${createCustomFieldGr4vyTransactionId},
  ${createCustomFieldGr4vyRefundId},
  ${createCustomFieldGr4vyTransactionResponse},
  ${createCustomFieldCustomerGr4vyBuyerId}
}
`
export {createCustomFieldsMutationQuery}
