// GraphQL query to get Customer
const getCustomerWithCartQuery = `
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

export { getCustomerWithCartQuery }
