import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTransactionById as getGr4vyTransactionById, getOrder } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getLogger } from "./../../utils"

const logger = getLogger()

const processRequest = async (request: Request, response: ServerResponse) => {
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

    // Get transaction by ID
    const transaction = await getGr4vyTransactionById(gr4vyTransactionId)

    if (!transaction) {
      throw {
        message: `Error in fetching gr4vy transaction for ID ${gr4vyTransactionId}`,
        statusCode: 400,
      }
    }

    // Fetch order id from the transaction
    const { external_identifier: orderId = "b2c4d973-578b-431d-866b-b068124a0c7e", status } =
      transaction?.body || {}

    // // Get order payment and transaction details
    const order = await getOrder({ request, orderId })

    if (!order) {
      throw {
        message: `Error in fetching CT order for ID ${orderId}`,
        statusCode: 400,
      }
    }

    // switch (status) {
    //   case "authorization_succeeded":
    //     updateCTOrderStatus("Confirmed")
    //     updateCTPaymentStatus("Paid")
    //     updateCTTransactionStatus("Success")
    //     break
    //   case "capture_pending":
    //     updateCTOrderStatus("Open")
    //     updateCTPaymentStatus("Pending")
    //     updateCTTransactionStatus("Pending")
    //     break
    //   case "capture_succeeded":
    //     updateCTOrderStatus("Confirmed")
    //     updateCTPaymentStatus("Paid")
    //     updateCTTransactionStatus("Success")
    //     break
    //   case "authorization_declined":
    //   case "authorization_failed":
    //     updateCTOrderStatus("Cancelled")
    //     updateCTPaymentStatus("Failed")
    //     updateCTTransactionStatus("Failure")
    //     break
    //   default:
    //     ""
    // }

    const responseData = {
      order,
      transaction,
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
