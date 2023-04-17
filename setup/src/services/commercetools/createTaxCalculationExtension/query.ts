// GraphQL query to create extension
const extension = `
  extension: createExtension(
    draft:{
      key:$taxCalcLevelExtensionKey
      destination: {
        HTTP: {
          url: $extensionUrl
          authentication: {
            AuthorizationHeader: {
              headerValue: $authHeader
            }
          }
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
  $authHeader: String!
  ){
    ${extension},
  }
`
export {createExtensionMutationQuery}
