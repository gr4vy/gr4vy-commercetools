import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getCustomerWithCart, createBuyer, updateCustomer, createEmbedToken } from "../../service"
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
    const { customer, cart, cartItems } = await getCustomerWithCart(bearerToken)

    if (!customer) {
      throw { message: "Customer information is missing or empty", statusCode: 400 }
    }

    if (!cart) {
      throw { message: "Cart information is missing or empty", statusCode: 400 }
    }

    const paymentConfig = await getCustomObjects()

    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }

    // create buyer in gr4vy if buyer id is not present
    if (!customer.gr4vyBuyerId) {
      const { body: buyer } = await createBuyer({ customer, paymentConfig })
      if (!buyer) {
        throw { message: "Error in creating buyer in CTP for customer", statusCode: 400 }
      }

      // Update CT customer with buyer info
      const isCustomerUpdated = await updateCustomer({ customer, buyer })
      if (!isCustomerUpdated) {
        throw { message: "Error in updating buyer in CTP for customer", statusCode: 400 }
      }

      // Set gr4vyBuyerId in customer
      customer.gr4vyBuyerId = {
        value: buyer.id,
      }
    }

    // Omit specific keys
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKey, ...restConfig } = paymentConfig.value
    const embedToken = await createEmbedToken({ customer, cart, paymentConfig })

    const responseData = {
      embedToken,
      ...restConfig,
      cartItems,
    }

    ResponseHelper.setResponseTo200(response, responseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing creating embed token request: Ending the process. ` +
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
