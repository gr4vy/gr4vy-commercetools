// GraphQL query to get Customer
const getCustomerWithCartQuery = `
    query {
        me {
            customer {
              id
              firstName
              middleName
              lastName
              version
              custom {
                customFieldsRaw{
                    name
                    value
                }
              }
            }
            activeCart{
                id
                customerId
                anonymousId
                totalPrice{
                    currencyCode
                    centAmount
                }
                country
                locale
            }
        }
    }
`

export { getCustomerWithCartQuery }
