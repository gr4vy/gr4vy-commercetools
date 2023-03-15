import { Constants } from "../../config/constants"
import { UpdateOrderStatus } from "../types"

const updateOrderStatus = async ({ orderId, status, transaction, ctTransactionType }: UpdateOrderStatus) => {

    let orderState, orderPaymentState, transactionState
    const {
        STATES: { GR4VY, CT },
    } = Constants

    console.log('GR4VY.TRANSACTION.STATUS_GROUPS')
    console.log(GR4VY.TRANSACTION.STATUS_GROUPS)
    //if (GR4VY.TRANSACTION)

    switch (status) {

        /*case GR4VY.TRANSACTION.AUTHORIZATION_SUCCEEDED:
            if (ctTransactionType !== CT.TRANSACTION.TYPES.AUTHORIZATION) {
                throw {
                    message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
                    statusCode: 400,
                }
            }
            orderState = CT.ORDER.CONFIRMED
            orderPaymentState = CT.ORDERPAYMENT.PAID
            transactionState = CT.TRANSACTION.SUCCESS
            break
        case GR4VY.TRANSACTION.CAPTURE_PENDING:
            if (ctTransactionType !== CT.TRANSACTION.TYPES.CHARGE) {
                throw {
                    message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
                    statusCode: 400,
                }
            }
            orderState = CT.ORDER.OPEN
            orderPaymentState = CT.ORDERPAYMENT.PENDING
            transactionState = CT.TRANSACTION.PENDING
            break
        case GR4VY.TRANSACTION.CAPTURE_SUCCEEDED:
            if (ctTransactionType !== CT.TRANSACTION.TYPES.CHARGE) {
                throw {
                    message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
                    statusCode: 400,
                }
            }
            orderState = CT.ORDER.CONFIRMED
            orderPaymentState = CT.ORDERPAYMENT.PAID
            transactionState = CT.TRANSACTION.SUCCESS
            break
        case GR4VY.TRANSACTION.AUTHORIZATION_DECLINED:
        case GR4VY.TRANSACTION.AUTHORIZATION_FAILED:
            if (ctTransactionType !== CT.TRANSACTION.TYPES.AUTHORIZATION) {
                throw {
                    message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
                    statusCode: 400,
                }
            }
            orderState = CT.ORDER.CANCELLED
            orderPaymentState = CT.ORDERPAYMENT.FAILED
            transactionState = CT.TRANSACTION.FAILURE
            break

        default:
            throw {
                message: `Error during updating CT order statuses with ID ${orderId}`,
                statusCode: 400,
            }*/
    }

    return {orderState, orderPaymentState, transactionState}
}

export { updateOrderStatus }
