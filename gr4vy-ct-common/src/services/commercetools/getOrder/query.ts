// GraphQL query to get order

const getOrderQuery = `
query ($orderId: String) {
    me {
      order(id:$orderId){
        id
        paymentInfo {
          payments {
            id
            key
            transactions {
              id
              type
              amount {
                currencyCode
                centAmount
              }
              state
            }
          }
        }
      }
    }
  }
`

export { getOrderQuery }
