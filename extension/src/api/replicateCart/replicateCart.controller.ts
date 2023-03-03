import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getTransactionById, getOrder, updateStatus, Constants } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getLogger } from "./../../utils"

const logger = getLogger()

const processRequest = async (request: Request, response: ServerResponse) => {
  try {

   console.log('11111')
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
      const { gr4vyTransactionId } = request.body

      if (!gr4vyTransactionId) {
          throw {
              message: `Required parameter gr4vyTransactionId is missing or empty`,
              statusCode: 400,
          }
      }
    const orderId = '92e1ab16-bb1c-438f-be5f-c954041a4520'
      // Fetch order id from the transaction
      /*const {
          external_identifier: orderId,
          status,
          amount: gr4vyTransactionAmount,
      } = gr4vyTransaction?.body || {}*/
    // // Get order payment and transaction details
    const {order} = await getOrder({orderId: orderId})
    console.log('333')
    ResponseHelper.setResponseTo200(response, {})

  } catch (e) {
    const errorStackTrace =
      `Error during parsing replicate cart request: Ending the process. ` +
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
