// GraphQL query to get Customer Active cart before trigger payment action
const getCustomerWithCartDetailsQuery = `
    query {
        me {
            customer {
                id
                firstName
                middleName
                lastName
                version
                customerNumber
                externalId
                email
                custom {
                    customFieldsRaw {
                        name
                        value
                    }
                }
            }
            activeCart {
                anonymousId
                billingAddress {
                    ...addressFields
                }
                shippingAddress {
                    ...addressFields
                }
            }
        }
    }
    
    fragment addressFields on Address{
      id
      firstName
      lastName
      email
      phone
      city
      country
      streetName
      streetNumber
      postalCode
      state
      building
      apartment
      region
      custom {
        customFieldsRaw {
          name
          value
        }
      }
    }
`

export { getCustomerWithCartDetailsQuery }
