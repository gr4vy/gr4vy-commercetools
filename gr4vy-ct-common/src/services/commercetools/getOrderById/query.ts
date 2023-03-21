// GraphQL query to get Order details
const getOrderDetailsQuery = `
    query ($orderId: String!) {
      order(id: $orderId) {
        version
        id
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
                interfaceId
                id
                version
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
