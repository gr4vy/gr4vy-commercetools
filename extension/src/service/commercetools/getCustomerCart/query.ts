// GraphQL query to get Customer
const getCustomerWithCart = `
    query {
        me {
            customer {
              id
              firstName
              middleName
              lastName
            }
            activeCart{
                id
                customerId
                anonymousId
            }
        }
    }
`

export { getCustomerWithCart }
