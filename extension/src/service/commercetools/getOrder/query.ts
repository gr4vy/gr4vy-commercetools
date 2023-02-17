// GraphQL query to get order details by ID
import c from "../../../config/constants";

const getOrderByIDQuery = `
    query ($id: String){
      order(id: $id) {
        customerEmail
        customerId
        anonymousId
        customer {
          firstName
          lastName
          customerNumber
          externalId
        }
        billingAddress {
          ...addressFields
        }
        shippingAddress {
          ...addressFields
        }
      }
    }

    fragment addressFields on Address{
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
    }
`;

const variables = {
  id: "2010d639-e74d-4dda-8f21-3bbecd0289ec",
}

export { getOrderByIDQuery, variables }
