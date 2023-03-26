// GraphQL query to create custom fields
const subscription = `
  subscription: createSubscription(
    draft:{
      key:$subsKey
      destination: {
        SQS:{
          queueUrl: $queueUrl
          accessKey: $accessKey
          accessSecret: $accessSecret
          region: $region
          authenticationMode:Credentials
        }
      }
      messages:{
        resourceTypeId: "order"
        types:["DeliveryAdded", "ReturnInfoAdded", "OrderStateChanged"]
      }
    }
  )
  {
    id
    version
    key
  }
`
const createSubscriptionsMutationQuery = `
mutation createSubscriptions (
  $subsKey:String!,
  $queueUrl: String!,
  $accessKey: String,
  $accessSecret: String,
  $region: String!){
  ${subscription},
}
`
export {createSubscriptionsMutationQuery}