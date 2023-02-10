// GraphQL query to get Customer
const getCustomerWithCart = `
    query {
        me {
            customer {
              email
              firstName
              lastName
            }
            activeCart{
                id
            }
        }
    }
`

export { getCustomerWithCart }
