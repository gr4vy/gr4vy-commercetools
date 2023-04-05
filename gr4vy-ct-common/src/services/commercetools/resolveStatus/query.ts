// GraphQL mutation to update status

const changeOrderState = `
  changeOrderState: updateOrder(
    id:$orderId,
    version: $orderVersion,
    actions: {
      changeOrderState: {
        orderState: $orderState
      }
    }
  ) {
    id
  }
`

const changePaymentState = `
  changePaymentState: updateOrder(
    id:$orderId,
    version: $orderPaymentVersion,
    actions: {
      changePaymentState: {
        paymentState: $orderPaymentState
      }
    }
  ) {
    id
  }
`
const changeTransactionState = `
  changeTransactionState: updatePayment(
    id:$paymentId,
    version:$paymentVersion,
    actions:[{
      changeTransactionState: {
        transactionId :$transactionId,
        state: $transactionState
      }
    },{
      setStatusInterfaceText:{
        interfaceText:$interfaceText
      }
    },
      {
        setStatusInterfaceCode:{
          interfaceCode:$interfaceCode
        }
      }]
  ){
    id
  }
`

const mutationQuery = `
  mutation(
    $orderId: String, 
    $orderState: OrderState!,
    $orderVersion:Long!,
    $orderPaymentState: PaymentState!,
    $orderPaymentVersion:Long!,
    $paymentId: String!,
    $paymentVersion:Long!,
    $transactionId:String!,
    $transactionState: TransactionState!,
    $interfaceText: String!,
    $interfaceCode: String!
  ){
    ${changeOrderState}
    ${changePaymentState}
    ${changeTransactionState}
  }
`

const mutationQueryWithoutTransaction = `
    mutation(
        $orderId: String, 
        $orderState: OrderState!,
        $orderVersion:Long!,
        $orderPaymentState: PaymentState!,
        $orderPaymentVersion:Long!
    ){
        ${changeOrderState}
        ${changePaymentState}
    }
`

export { mutationQuery, mutationQueryWithoutTransaction }
