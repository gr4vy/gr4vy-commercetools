// GraphQL query to create custom fields
const createSubscription1 = `
  createSubscription1: createSubscription(
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
  ${createSubscription1},
}
`
export {createSubscriptionsMutationQuery}
