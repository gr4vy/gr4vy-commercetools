// GraphQL query to create extension
const extension = `
  extension: createExtension(
    draft:{
      key:$taxCalcLevelExtensionKey
      destination: {
        HTTP: {
          url: $extensionUrl
        }
      }
      triggers: [{
        resourceTypeId: "cart"
        actions:[ Create ]
      }]
    }
  )
  {
    key
    id
    version
  }
`
const createExtensionMutationQuery = `
mutation createExtension (
  $taxCalcLevelExtensionKey:String!,
  $extensionUrl: String!
  ){
    ${extension},
  }
`
export {createExtensionMutationQuery}
