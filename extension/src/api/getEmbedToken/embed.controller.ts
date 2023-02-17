import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import {
  getCustomerWithCart,
  getCustomObjects,
  createBuyer,
  updateCustomer,
  createEmbedToken,
} from "../../service"
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
    const { customer, cart } = await getCustomerWithCart(bearerToken)
    const paymentConfig = await getCustomObjects()

    // create buyer in gr4vy if buyer id is not present
    if (!customer.gr4vyBuyerId) {
      const { body: buyer } = await createBuyer({ customer, cart, paymentConfig })
      // Update CT customer with buyer info
      const isCustomerUpdated = await updateCustomer({ customer, buyer })
      if (isCustomerUpdated) {
        // Set gr4vyBuyerId in customer
        customer.gr4vyBuyerId = {
          value: buyer.id,
        }
      }
    }

    const embedToken = await createEmbedToken({ customer, cart, paymentConfig })

    ResponseHelper.setResponseTo200(response, { customer, embedToken })
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
