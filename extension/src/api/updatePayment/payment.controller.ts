import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger, getTransactionById, getOrder, prepareCTStatuses, updateOrderWithPayment, } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()

  // Log the request
  logger.debug({
    method: request.method,
    url: request.url,
    headers: request.headers,
  })

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

    let iteration = 0
    const maxIteration = Number(process.env.PAYMENT_UPDATE_MAX_RETRY) || 2

    while (iteration < maxIteration) {
      logger.debug(`Retry iteration: ${iteration + 1}`)
      const { hasErrDueConcurrentModification, ...restofResponse } = await handleUpdatePayment({
        request,
        gr4vyTransactionResult,
      })
      iteration++
      if (!hasErrDueConcurrentModification) {
        return ResponseHelper.setResponseTo200(response, restofResponse)
      }
    }

    if (iteration === maxIteration) {
      throw {
        message: `Maximum retry failed!. Unable to update payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}`,
        statusCode: 409,
      }
    }
  } catch (e) {
    const errorStackTrace =
      `Error during parsing update payment request: Ending the process. ` +
      `Error: ${JSON.stringify(e)}`
    logger.debug(errorStackTrace)

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

const handleUpdatePayment = async ({ request, gr4vyTransactionResult }: any) => {
  // Fetch order id from the transaction
  const gr4vyTransaction = gr4vyTransactionResult?.body || {}
  const {
    externalIdentifier: orderId,
    status,
    amount: gr4vyTransactionAmount,
    capturedAmount: gr4vyCapturedAmount,
    refundedAmount: gr4vyRefundedAmount,
  } = gr4vyTransaction

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

  const ctTransactionAmount = order?.taxedPrice?.totalGross?.centAmount
  const ctTransactionType = transaction?.type
  const ctTransactionId = transaction?.id

  // Double check if the amount are equal
  if (gr4vyTransactionAmount !== ctTransactionAmount) {
    throw {
      message: `Error in mismatch amounts for gr4vy and CT for order payment ID ${payment?.id}`,
      statusCode: 400,
    }
  }

  const { orderState, orderPaymentState, transactionState } = prepareCTStatuses(
    status,
    ctTransactionType,
    ctTransactionId,
    gr4vyCapturedAmount,
    gr4vyRefundedAmount
  )

  // Create custom field in CT for order to save Gr4vy transaction id
  // Update payment info in CT based on Gr4vy transaction
  const { hasOrderWithPaymentUpdated, hasErrDueConcurrentModification } =
    await updateOrderWithPayment({
      order,
      orderState,
      orderPaymentState,
      transactionState,
      gr4vyTransaction,
    })

  const responseData = {
    order: order.id,
    isUpdated: !!hasOrderWithPaymentUpdated,
    hasErrDueConcurrentModification,
  }

  return responseData
}

export default { processRequest }
