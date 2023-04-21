import { ServerResponse } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, getLogger } from "@gr4vy-ct/common"
import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "../../helper/response"
import { isPostRequest } from "../../helper"
import { Request } from "../../types"
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

    const paymentConfig = await getCustomObjects()
    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }
    //if Gr4vy payment is not active, return.
    if(!paymentConfig.active) {
      ResponseHelper.setResponseTo200(response, { active: false })
    }

    const { event } = request.body
    const transactionCaptureResult = await handleTransactionCapture(event)
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
