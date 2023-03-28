// GraphQL query to get Order details
const getOrderDetailsQuery = `
    query ($orderId: String!) {
      order(id: $orderId) {
        id
        version
        orderNumber
        orderState
        paymentState
        lineItems{
          id
          productId
          quantity
          totalPrice{
            centAmount
          }
          price{
            value{
              centAmount
            }
          }
        }
        paymentInfo{
          payments {
            id
            version
            interfaceId
            transactions {
              id
              type
              state
              amount {
                currencyCode
                centAmount
              }
              custom {
                customFieldsRaw {
                  name
                  value
                }
              }
            }
          }
        }
        returnInfo{ 
          items{ 
            id 
            quantity 
            type
            paymentState
          } 
        } 
        totalPrice{
          type
          centAmount
          fractionDigits
          currencyCode
        }
        custom{
          customFieldsRaw{
            name
            value
          }
        }
      }
    }
`
export { getOrderDetailsQuery }
