// GraphQL query to get Customer
const getCustomerWithCartQuery = `
    query($locale:Locale) {
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
            activeCart {
                id
                totalPrice{
                  currencyCode
                  centAmount
                }
                lineItems{
                  id
                  productId
                  name(locale:$locale)
                  taxedPrice {
                    totalTax{
                      currencyCode
                      centAmount
                    }
                  }
                  quantity
                  discountedPricePerQuantity{
                    discountedPrice{
                      value {
                        currencyCode
                        centAmount
                      }
                    }
                  }
                  price{
                    value {
                      currencyCode
                      centAmount
                    }
                  }
                  productType {
                    name
                  }
                  variant {
                    id
                    sku
                    images{
                      url
                    }
                  }
                }
                country
                locale
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
