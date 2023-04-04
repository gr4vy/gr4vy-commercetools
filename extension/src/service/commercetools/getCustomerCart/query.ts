// GraphQL query to get Customer
const getCustomerWithCartQuery = `
  query ($locale: Locale) {
    me {
      customer {
        id
        version
        firstName
        middleName
        lastName
        email
        custom {
          customFieldsRaw {
            name
            value
          }
        }
      }
      activeCart {
        id
        version
        customerId
        anonymousId
        billingAddress {
          ...addressFields
        }
        shippingAddress {
          ...addressFields
        }
        totalPrice {
          currencyCode
          centAmount
        }
        taxedShippingPrice{
          totalGross{
            currencyCode
            centAmount
          }
          totalTax{
            currencyCode
            centAmount
          }
        }
        taxedPrice{
          totalTax {
            currencyCode
            centAmount
          }
          totalGross{
            currencyCode
            centAmount
          }
        }
        custom {
          customFieldsRaw {
            name
            value
          }
        }
        lineItems {
          id
          productId
          name(locale: $locale)
          taxedPrice {
            totalTax {
              currencyCode
              centAmount
            }
            totalGross{
              currencyCode
              centAmount
            }
          }
          taxRate {
            includedInPrice
          }
          quantity
          discountedPricePerQuantity {
            quantity
            discountedPrice {
              value {
                currencyCode
                centAmount
              }
            }
          }
          price {
            value {
              currencyCode
              centAmount
            }
            discounted {
              value {
                centAmount
              }
            }
          }
          productType {
            name
          }
          variant {
            id
            sku
            images {
              url
            }
          }
        }
        country
        locale
        custom {
          customFieldsRaw {
            name
            value
          }
        }
        shippingInfo {
          price {
            centAmount
            currencyCode
          }
          discountedPrice{
            value{
              centAmount
            }
          }
          shippingMethodName
        }
      }
    }
  }

  fragment addressFields on Address {
    id
    firstName
    lastName
    email
    phone
    city
    country
    streetName
    streetNumber
    additionalStreetInfo
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

const getProductsCategoriesQuery = `
  query($skus:[String!], $locale:Locale) {
    products(
      skus:$skus
    ){
      results {
        id
        masterData{
          current{
            categories{
              id
              key
              name(locale:$locale)
            }
          }
        }
      }
    }
  }
`
export { getCustomerWithCartQuery, getProductsCategoriesQuery }
