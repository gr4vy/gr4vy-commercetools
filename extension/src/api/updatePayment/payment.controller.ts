import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTransactionById, getOrder, updateStatus, Constants } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getLogger } from "./../../utils"
import { updateOrderWithPayment } from "../../service"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()
  if (!isPostRequest(request)) {
    logger.debug(`Received non-POST request: ${request.method}. The request will not be processed!`)
    return ResponseHelper.setResponseError(response, {
      httpStatusCode: StatusCodes.BAD_REQUEST,
      errors: [
        {
          code: StatusCodes.BAD_REQUEST,
          message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        },
      ],
    })
  }

  try {
    const { gr4vyTransactionId } = request.body

    if (!gr4vyTransactionId) {
      throw {
        message: `Required parameter gr4vyTransactionId is missing or empty`,
        statusCode: 400,
      }
    }

    // Get gr4vy transaction by ID
    const gr4vyTransactionResult = await getTransactionById(gr4vyTransactionId)
    if (!gr4vyTransactionResult) {
      throw {
        message: `Error in fetching gr4vy transaction for ID ${gr4vyTransactionId}`,
        statusCode: 400,
      }
    }

    // Fetch order id from the transaction
    const gr4vyTransaction = gr4vyTransactionResult?.body || {}
    const { externalIdentifier: orderId, status, amount: gr4vyTransactionAmount } = gr4vyTransaction

    // Get order payment and transaction details
    const order = await getOrder({ request, orderId })

    if (!order) {
      throw {
        message: `Error in fetching CT order`,
        statusCode: 400,
      }
    }

    const [payment] = order?.paymentInfo?.payments || []

    if (!payment) {
      throw {
        message: `Error in fetching payment for order ID ${orderId}`,
        statusCode: 400,
      }
    }

    const [transaction] = payment?.transactions || []

    if (!transaction) {
      throw {
        message: `Error in fetching transaction for order payment ID ${payment?.id}`,
        statusCode: 400,
      }
    }

    const ctTransactionAmount = transaction?.amount?.centAmount
    const ctTransactionType = transaction?.type

    // Double check if the amount are equal
    if (gr4vyTransactionAmount !== ctTransactionAmount) {
      throw {
        message: `Error in mismatch amounts for gr4vy and CT for order payment ID ${payment?.id}`,
        statusCode: 400,
      }
    }

    let orderState, orderPaymentState, transactionState
    const {
      STATES: { GR4VY, CT },
    } = Constants

    switch (status) {
      case GR4VY.TRANSACTION.AUTHORIZATION_SUCCEEDED:
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
        }
    }

    const hasStatusUpdated = await updateStatus({
      order,
      orderState,
      orderPaymentState,
      transactionState,
    })
    // Get updated order
    const updatedOrder = await getOrder({ request, orderId })
    // Create custom field in CT for order to save Gr4vy transaction id
    // Update payment info in CT based on Gr4vy transaction
    const hasPaymentInfoUpdated = await updateOrderWithPayment({
      updatedOrder,
      gr4vyTransaction,
    })

    const responseData = {
      order: updatedOrder.id,
      isUpdated: !!hasStatusUpdated && !!hasPaymentInfoUpdated,
    }

    ResponseHelper.setResponseTo200(response, responseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing update payment request: Ending the process. ` +
      `Error: ${JSON.stringify(e)}`
    logger.error(errorStackTrace)

    ResponseHelper.setResponseError(response, {
      httpStatusCode: e.statusCode || 500,
      errors: [
        {
          code: e.statusCode || 500,
          message: e?.response?.body?.message || e.message,
        },
      ],
    })
  }
}

export default { processRequest }
