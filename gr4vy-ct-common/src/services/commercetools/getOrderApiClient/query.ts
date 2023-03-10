// GraphQL query to get order

const getOrderByIDQuery = `
    query ($orderId: String){
      order(id: $orderId) {
        id
        version
        orderState
        paymentState
        paymentInfo {
          payments {
            id
            version
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
`;

export { getOrderByIDQuery }
