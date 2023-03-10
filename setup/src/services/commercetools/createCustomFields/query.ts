// GraphQL query to create custom fields
const createCustomFieldsQuery = `
mutation createCustomField (
  $key:String!,
  $locale: Locale!,
  $name:String!,
  $label:String!,
  $description:String!){
  createTypeDefinition(    
    draft:{
      key: $key
      name:{
        locale: $locale
        value: $description
      }
      resourceTypeIds: ["order"]
      fieldDefinitions:{
        type:{
          String:{
            dummy:"string"
          }
        }
        name:$name
        required:false
        label:{
          locale: $locale
          value: $label
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
