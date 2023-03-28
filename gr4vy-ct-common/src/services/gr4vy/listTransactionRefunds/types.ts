export declare type ListRefundTransactions = {
  response: {
    body: {
      items: [
        {
          type: string
          id: string
          transactionId: string
          status: string
          currency: string
          amount: string
        }
      ]
    }
  }
}

export declare type RefundItems = {
  items: [
    {
      type: string
      id: string
      transactionId: string
      status: string
      currency: string
      amount: string
    }
  ]
}
