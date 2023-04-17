import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects, getLogger } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getCustomerWithCart, createEmbedToken } from "../../service"
import { resolveCustomerBuyerId } from "./../../utils"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()
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
    // load commercetools data
    const { locale } = request.body
    const { customer, cart, cartItems } = await getCustomerWithCart(request, locale)

    if (!cart) {
      throw { message: "Cart information is missing or empty", statusCode: 400 }
    }

    const paymentConfig = await getCustomObjects()

    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }

    // Resolve the customer buyer id in CT
    await resolveCustomerBuyerId({ customer, cart, paymentConfig })

    const gr4vyBuyerId = customer?.gr4vyBuyerId ?? cart.gr4vyBuyerId

    // Omit specific keys
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKey, ...restConfig } = paymentConfig
    const embedToken: string = await createEmbedToken({ customer, cart, paymentConfig, cartItems })

    const {
      taxedPrice: {
        totalGross: { centAmount, currencyCode },
      },
      country,
      locale: cartLocale,
    } = cart

    const responseData = {
      embedToken,
      buyerId: gr4vyBuyerId?.value,
      amount: centAmount,
      currency: currencyCode,
      country,
      ...restConfig,
      cartItems,
      locale: cartLocale,
    }

    ResponseHelper.setResponseTo200(response, responseData)
  } catch (e) {
    const errorStackTrace =
      `Error during parsing creating embed token request: Ending the process. ` +
      `Error: ${e}`
    logger.debug(errorStackTrace)

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
