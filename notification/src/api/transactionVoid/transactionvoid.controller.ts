import { ServerResponse } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getCustomObjects, getLogger} from "@gr4vy-ct/common"
import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { Request } from "./../../types"
import { handleTransactionVoid } from "../../handler"

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

    //Return if gr4vy payment is not enabled
    const paymentConfig = await getCustomObjects()
    const { active } = paymentConfig || {}
    if (!active) {
      ResponseHelper.setResponseTo200(response, [])
    }

    const { event } = request.body
    const transactionVoidResult = await handleTransactionVoid(event)
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
