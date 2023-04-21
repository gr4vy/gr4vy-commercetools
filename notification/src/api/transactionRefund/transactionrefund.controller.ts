import { ServerResponse } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {getCustomObjects, getLogger} from "@gr4vy-ct/common"
import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "../../helper/response"
import { isPostRequest } from "../../helper/methods"
import { Request } from "../../types"
import { handleTransactionRefund } from "../../handler"
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

    //Return if gr4vy payment is not enabled
    const paymentConfig = await getCustomObjects()
    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }
    const { active } = paymentConfig || {}
    if (!active) {
      ResponseHelper.setResponseTo200(response, { active: false })
    }

    const { event } = request.body
    const body = await prepareRequestBody(event)
    const { orderId, returnInfo } = body

    if (!orderId) {
      throw {
        message: `Required parameter orderId is missing or empty`,
        statusCode: 400,
      }
    }

    if (!returnInfo) {
      throw {
        message: `Required parameter returnInfo is missing or empty`,
        statusCode: 400,
      }
    } else {
      returnInfo.items.forEach(
        (returnItem: { id: string; lineItemId: string; quantity: number }) => {
          if (!returnItem.id || !returnItem.lineItemId || !returnItem.quantity) {
            throw {
              message: `Required parameter returnInfo is in wrong format. It should be in a format of returnInfo:{items:[{ returnItemId: string; lineItemId: string, quantity: number }]}`,
              statusCode: 400,
            }
          }
        }
      )
    }

    const transactionRefundResult = await handleTransactionRefund(event)
    ResponseHelper.setResponseTo200(response, transactionRefundResult)
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
