const mutation = (shouldIncludeInterfaceId: boolean, shouldIncludeInterface: boolean) => `
mutation (
  $orderId: String!,
  $version: Long!,
  $customFieldKey:String!,
  $customFieldName:String!,
  $gr4vyTransactionId: String!,
  $type: String!,
  $paymentId:String!,
  $paymentVersion: Long!,
  $methodInfoName: String!,
  $methodInfoLocale: Locale!,
  ${shouldIncludeInterfaceId ? `$interfaceId: String!,` : ``}
  ${shouldIncludeInterface ? `$interface: String!,` : ``}
  $interfaceCode: String!,
  $interfaceText: String!,
  $transactionId: String!,
  $timestamp:DateTime!
) {
  # Order update action
  updateOrder: updateOrder(
    id:$orderId
    version:$version
    actions:[{      
      setCustomType:{
        type: {
          key: $customFieldKey
          typeId:$type
        }
        fields:{
          name:$customFieldName
          value:$gr4vyTransactionId
        }
      }
    }]
  ){
    id
    version
  }
  # Payment update actions
  updatePayment: updatePayment(
    # The current version of the Payment.
    version: $paymentVersion

    # The id of the Customer to update.
    id: $paymentId

    # An array of update actions.
    actions: [
      {
        # The action to change the method info name.
        setMethodInfoName:{
          name:{
            locale:$methodInfoLocale,
            value:$methodInfoName
          }
        }
      },
      {
        setStatusInterfaceCode:{
          interfaceCode:$interfaceCode
        }
      },
      {
        setStatusInterfaceText:{
          interfaceText:$interfaceText
        }
      },
      ${
        shouldIncludeInterface
          ? `
        {
          setMethodInfoInterface:{
            interface:$interface
          }
        },
        `
          : ``
      }
      ${
        shouldIncludeInterfaceId
          ? `
          {
            setInterfaceId:{
              interfaceId:$interfaceId
            }
          },
          `
          : ``
      }
      {
        changeTransactionTimestamp:{
          transactionId:$transactionId,
          timestamp:$timestamp
        }
      }
    ]
  ) {
    # Return the id, version
    id
    version
  }
}
`
export { mutation }
