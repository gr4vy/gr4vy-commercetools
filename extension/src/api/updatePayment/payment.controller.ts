import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getLogger, getAuthorizationRequestHeader } from "./../../utils"

const logger = getLogger()

const processRequest = async (request: IncomingMessage, response: ServerResponse) => {
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
    // Verify if header token exists:
    const bearerToken = getAuthorizationRequestHeader(request)
    if (!bearerToken) {
      logger.debug(`Received Unauthorized request for url: ${request.url}`)
      return ResponseHelper.setResponseError(response, {
        httpStatusCode: StatusCodes.UNAUTHORIZED,
        errors: [
          {
            code: StatusCodes.UNAUTHORIZED,
            message: "The request is unauthorized.",
          },
        ],
      })
    }

    // load commercetools data
    const customer = ""

    if (!customer) {
      throw { message: "Customer information is missing or empty", statusCode: 400 }
    }

    const responseData = {}

    ResponseHelper.setResponseTo200(response, responseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing creating update payment request: Ending the process. ` +
      `Error: ${JSON.stringify(e)}`
    logger.error(errorStackTrace)

    ResponseHelper.setResponseError(response, {
      httpStatusCode: e.statusCode || 500,
      errors: [
        {
          code: e.statusCode || 500,
          message: e.message,
        },
      ],
    })
  }
}

export default { processRequest }
