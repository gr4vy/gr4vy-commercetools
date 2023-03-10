// GraphQL query to create custom fields
const createCustomFieldsQuery = `
mutation createCustomField (
  $key:String!,
  $locale: Locale!){
  createTypeDefinition(    
    draft:{
      key: $key
      name:{
        locale: $locale
        value: "Additional field to order Gr4vy Buyer ID Test4"
      }
      resourceTypeIds: ["order"]
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:"gr4vyBuyerIdTest4"
        required:false
        label:{
          locale: $locale
          value: "Gr4vy Buyer IDTest4"
        }
        inputHint:SingleLine      
      }
    }
  ){
    id
    version
  }
}
`
export {createCustomFieldsQuery}
