// GraphQL query to create custom fields
const subscription = `
  subscription: createSubscription(
    draft:{
      key:$subsKey
      destination: {
        SQS:{
          queueUrl: $queueUrl
          region: $region
          authenticationMode:$authMode
          accessKey: $accessKey
          accessSecret: $accessSecret
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
  $region: String!,
  $authMode: AwsAuthenticationMode!,
  $accessKey: String,
  $accessSecret: String
  ){
  ${subscription},
}
`
export {createSubscriptionsMutationQuery}
