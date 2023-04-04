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
            discounted{
              value{
                centAmount
              }
            }
          }
          discountedPricePerQuantity{
            quantity
            discountedPrice{
              value{
                centAmount
              }
            }
          }
        }
        paymentInfo{
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
            ... on LineItemReturnItem {
              type
              lineItemId
              id
              quantity
              comment
              shipmentState
              paymentState
            }
          } 
        } 
        totalPrice{
          type
          centAmount
          fractionDigits
          currencyCode
        }
        taxedPrice{
          taxPortions{
            rate
          }
          totalNet{
            currencyCode
            centAmount
          }
          totalGross {
            currencyCode
            centAmount
          }
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
