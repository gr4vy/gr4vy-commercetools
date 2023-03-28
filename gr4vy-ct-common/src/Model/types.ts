export declare type UpdateOrderStatus = {
    orderId: string
    status: string
    transaction: Transaction
    ctTransactionType: string
    gr4vyTransactionType: string
}

export declare type Transaction = {
    id: string
    type: string
}
