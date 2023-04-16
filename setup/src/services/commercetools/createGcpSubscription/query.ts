// GraphQL query to create custom fields
const subscription = `
  subscription: createSubscription(
    draft:{
      key:$subsKey
      destination: {
        GoogleCloudPubSub:{
          topic: $topic
          projectId: $projectId
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
  $region: String!){
  ${subscription},
}
`
export {createSubscriptionsMutationQuery}
