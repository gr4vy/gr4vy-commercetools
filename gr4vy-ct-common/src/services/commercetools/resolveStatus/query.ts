// GraphQL mutation to update status

const updateOrder = `
  updateOrder: updateOrder(
    id: $orderId,
    version: $orderVersion,
    actions: [{
      changePaymentState: {
        paymentState: $orderPaymentState
      }
    },{
      changeOrderState: {
        orderState: $orderState
      }
    }]
  ) {
    id
  }
`
const updatePayment = `
  updatePayment: updatePayment(
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
    },{
      changeTransactionTimestamp:{
        transactionId: $transactionId,
        timestamp:$timestamp
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
    $paymentId: String!,
    $paymentVersion:Long!,
    $transactionId:String!,
    $transactionState: TransactionState!,
    $interfaceText: String!,
    $interfaceCode: String!,
    $timestamp: DateTime!,
  ){
    ${updateOrder}
    ${updatePayment}
  }
`

const mutationQueryWithoutTransaction = `
    mutation(
        $orderId: String, 
        $orderState: OrderState!,
        $orderVersion:Long!,
        $orderPaymentState: PaymentState!,
    ){
        ${updateOrder}
    }
`

export { mutationQuery, mutationQueryWithoutTransaction }
