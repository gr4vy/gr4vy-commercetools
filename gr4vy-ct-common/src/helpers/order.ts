import { Constants } from "./../config"

export const prepareCTStatuses = (
  gr4vyTransactionStatus: string,
  ctTransactionType: string,
  ctTransactionId: string,
  gr4vyCapturedAmount: number,
  gr4vyRefundedAmount: number
) => {
  if (!gr4vyTransactionStatus) {
    return
  }

  const {
    STATES: { GR4VY, CT },
  } = Constants

  switch (gr4vyTransactionStatus) {
    case GR4VY.TRANSACTION.AUTHORIZATION_SUCCEEDED:
      if (ctTransactionType !== CT.TRANSACTION.TYPES.AUTHORIZATION) {
        throw {
          message: `Error mismatch transaction type for transaction ID ${ctTransactionId}`,
          statusCode: 400,
        }
      }
      return {
        orderState: CT.ORDER.CONFIRMED,
        orderPaymentState: CT.ORDERPAYMENT.PAID,
        transactionState: CT.TRANSACTION.SUCCESS,
      }

    case GR4VY.TRANSACTION.CAPTURE_PENDING:
    case GR4VY.TRANSACTION.PROCESSING:
    case GR4VY.TRANSACTION.BUYER_APPROVAL_PENDING:
      if (ctTransactionType !== CT.TRANSACTION.TYPES.CHARGE) {
        throw {
          message: `Error mismatch transaction type for transaction ID ${ctTransactionId}`,
          statusCode: 400,
        }
      }
      return {
        orderState: CT.ORDER.OPEN,
        orderPaymentState: CT.ORDERPAYMENT.PENDING,
        transactionState: CT.TRANSACTION.PENDING,
      }
    case GR4VY.TRANSACTION.CAPTURE_SUCCEEDED:
      return {
        orderState:
          gr4vyCapturedAmount === gr4vyRefundedAmount ? CT.ORDER.COMPLETE : CT.ORDER.CONFIRMED,
        orderPaymentState: CT.ORDERPAYMENT.PAID,
        transactionState: CT.TRANSACTION.SUCCESS,
      }
    case GR4VY.TRANSACTION.AUTHORIZATION_DECLINED:
    case GR4VY.TRANSACTION.AUTHORIZATION_FAILED:
    case GR4VY.TRANSACTION.AUTHORIZATION_VOIDED:
    case GR4VY.TRANSACTION.AUTHORIZATION_VOID_PENDING:
      if (ctTransactionType !== CT.TRANSACTION.TYPES.AUTHORIZATION) {
        throw {
          message: `Error mismatch transaction type for transaction ID ${ctTransactionId}`,
          statusCode: 400,
        }
      }
      return {
        orderState: CT.ORDER.CANCELLED,
        orderPaymentState: CT.ORDERPAYMENT.FAILED,
        transactionState: CT.TRANSACTION.FAILURE,
      }
    default:
      throw {
        message: `Error during prearing CT order statuses for transaction ID ${ctTransactionId}`,
        statusCode: 400,
      }
  }
}
