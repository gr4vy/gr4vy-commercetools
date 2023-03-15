export declare type UpdateOrderStatus = {
    orderId: string
    status: string
    transaction: Transaction
    ctTransactionType: string
}

export declare type Transaction = {
    id: string
    type: string
}
