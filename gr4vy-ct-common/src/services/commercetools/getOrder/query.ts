// GraphQL query to get order

const getOrderQuery = `
query ($orderId: String) {
    me {
      order(id:$orderId){
        id
        version
        paymentInfo {
          payments {
            id
            version
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
