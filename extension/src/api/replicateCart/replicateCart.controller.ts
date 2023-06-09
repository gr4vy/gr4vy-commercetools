import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
import {
  getLogger,
  getOrder,
  resolveStatus,
  replicateCartFromOrder,
  Constants,
  prepareCTStatuses,
  updateOrderWithPayment,
  resolveOrderPayment,
  prepareCTStatusesType
} from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()
  try {
    if (!isPostRequest(request)) {
      logger.debug(
        `Received non-POST request: ${request.method}. The request will not be processed!`
      )
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

    const { orderId, transaction: gr4vyTransaction } = request.body
    if (!orderId) {
      throw {
        message: `Required parameter orderId is missing or empty`,
        statusCode: 400,
      }
    }

    const order = await getOrder({ request, orderId })
    if (!order) {
      throw {
        message: `Error in fetching CT order`,
        statusCode: 400,
      }
    }

    const {
      STATES: { CT },
    } = Constants

    const {
      id,
      status,
      intent,
      type,
      capturedAmount: gr4vyCapturedAmount,
      refundedAmount: gr4vyRefundedAmount,
      rawResponseCode,
      rawResponseDescription,
    } = gr4vyTransaction || {}

    const haveTransactionInfo = !!(id && status && type && intent)

    if (haveTransactionInfo) {
      // Update payment info
      const payment = resolveOrderPayment(order)
      const [transaction] = payment?.transactions || []
      const { type: ctTransactionType, id: ctTransactionId } = transaction || {}
      const { orderState, orderPaymentState, transactionState }: prepareCTStatusesType =
        prepareCTStatuses(
          status,
          ctTransactionType,
          ctTransactionId,
          gr4vyCapturedAmount,
          gr4vyRefundedAmount
        )

      await updateOrderWithPayment({
        order,
        orderState,
        orderPaymentState,
        transactionState,
        gr4vyTransaction,
      })
    } else {
      //Cancel order
      const orderState = CT.ORDER.CANCELLED
      const orderPaymentState = CT.ORDERPAYMENT.FAILED
      const transactionState = CT.TRANSACTION.FAILURE
      const interfaceText = rawResponseDescription || CT.ORDERPAYMENT.FAILED
      const interfaceCode = rawResponseCode || CT.ORDERPAYMENT.FAILED

      await resolveStatus({
        order,
        orderState,
        orderPaymentState,
        transactionState,
        interfaceText,
        interfaceCode,
      })
    }

    //Replicate cart from order
    const replicateCartResult = await replicateCartFromOrder({ orderId })

    const replicateCartResponseData = {
      cartId: replicateCartResult.id,
    }

    ResponseHelper.setResponseTo200(response, replicateCartResponseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing replicate cart request: Ending the process. ` +
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

export default { processRequest }
