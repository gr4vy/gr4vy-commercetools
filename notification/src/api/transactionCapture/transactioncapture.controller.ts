import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "../../helper/response"
import { isPostRequest, prepareRequestBody } from "../../helper"
import { Request } from "../../types"
import { getLogger } from "../../utils"
import { handleTransactionCapture } from "./../../handler"

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

    if (!body.orderId) {
      throw {
        message: `Required parameter orderId is missing or empty`,
        statusCode: 400,
      }
    }

    const transactionCaptureResult = await handleTransactionCapture(body)
    ResponseHelper.setResponseTo200(response, transactionCaptureResult)
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
