// GraphQL query to get order

const getOrderQuery = `
query ($orderId: String) {
    me {
      order(id:$orderId){
        id
        version
        taxedPrice {
          totalGross {
            centAmount
          }
        }
        paymentInfo {
          payments {
            id
            version
            lastModifiedAt
            interfaceId
            paymentMethodInfo {
              paymentInterface
            }
            transactions {
              id
              type
              state
              amount {
                currencyCode
                centAmount
              }
            }
          }
        }
      }
    }
  }
`

export { getOrderQuery }
