import { Constants, successStatuses, processStatuses, cancelStatuses } from "../../config"
import { UpdateOrderStatus } from "../types"

const updateOrderStatus = async ({ orderId, status, transaction, ctTransactionType, gr4vyTransactionType }: UpdateOrderStatus) => {

    let returnTransactionStatus = {orderState: "", orderPaymentState: "", transactionState: ""}

    const {
        STATES: { GR4VY, CT, CT_GRAVY_MAPPING },
    } = Constants

    //Check if the Gr4vy transaction type is matching with CT transaction type
    if (ctTransactionType === CT.TRANSACTION.TYPES.AUTHORIZATION &&
        gr4vyTransactionType !== GR4VY.TRANSACTION.TYPES.AUTHORIZE) {
        throw {
            message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
            statusCode: 400,
        }
    }

    if (ctTransactionType === CT.TRANSACTION.TYPES.CHARGE &&
        gr4vyTransactionType !== GR4VY.TRANSACTION.TYPES.CAPTURE) {
        throw {
            message: `Error mismatch transaction type for transaction ID ${transaction?.id}`,
            statusCode: 400,
        }
    }

    // Mapping Gr4vy status with CT mapping
    if(successStatuses.find(successStatus => successStatus === status)) {
        returnTransactionStatus = CT_GRAVY_MAPPING.SUCCESS
    } else if (processStatuses.find(processStatus => processStatus === status)) {
        returnTransactionStatus = CT_GRAVY_MAPPING.PROCESS
    } else if (cancelStatuses.find(cancelStatus => cancelStatus === status)) {
        returnTransactionStatus = CT_GRAVY_MAPPING.CANCEL
    } else {
        throw {
            message: `Error during updating CT order statuses with ID ${orderId}`,
            statusCode: 400,
        }
    }

    return returnTransactionStatus
}

export { updateOrderStatus }
