import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { Request } from "./../../types"
import { getLogger } from "./../../utils"
import { handleTransactionVoid } from "../../handler"
import { prepareRequestBody } from "../../helper"

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

    const { event } = request.body
    const body = await prepareRequestBody(event)
    const { orderId } = body

    if (!orderId) {
      throw {
        message: `Required parameter orderId is missing or empty`,
        statusCode: 400,
      }
    }

    const transactionVoidResult = await handleTransactionVoid(body)
    ResponseHelper.setResponseTo200(response, transactionVoidResult)
  } catch (e) {
    ResponseHelper.setResponseError(response, {
      httpStatusCode: 500,
      errors: [
        {
          code: 500,
          message: e.message,
        },
      ],
    })
  }
}

export default { processRequest }
