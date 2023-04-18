import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
import { getLogger, getTransactionById } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { handleUpdatePayment, handleTransactions } from "./../../handler"

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
    logger.debug("request body", request.body)

    const { type: webhookEventType, target } = request.body

    if (!webhookEventType || (webhookEventType && webhookEventType !== "event")) {
      throw {
        message: `A Webhook request was received with an invalid entity type - ${webhookEventType}`,
        statusCode: 422,
      }
    }

    const gr4vyTransactionId = target.type === "transaction" ? target?.id : target.transaction_id

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
      iteration++
      logger.debug(`handleUpdatePayment:retry iteration: ${iteration}`)
      const { hasErrDueConcurrentModification, orderId, gr4vyTransaction, isUpdated } =
        await handleUpdatePayment({
          request,
          gr4vyTransactionResult,
          doNotModifyTransaction: true,
        })

      if (!hasErrDueConcurrentModification) {
        let transIteration = 0
        while (transIteration < maxIteration) {
          transIteration++
          logger.debug(`handleTransactions:retry iteration: ${transIteration}`)
          const result = await handleTransactions(orderId, gr4vyTransaction)
          if (!result?.hasErrDueConcurrentModification) {
            return ResponseHelper.setResponseTo200(response, {
              orderId,
              isUpdated,
            })
          }
        }
        if (transIteration === maxIteration) {
          throw {
            message: `Maximum retry failed!. Unable to update payment due to concurrency issue for Transaction ID ${gr4vyTransactionId}`,
            statusCode: 409,
          }
        }
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

export default { processRequest }
