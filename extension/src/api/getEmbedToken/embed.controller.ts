import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import {
  getCustomerWithCart,
  createBuyer,
  updateCustomerCart,
  createEmbedToken,
  updateCart
} from "../../service"
import { getLogger } from "./../../utils"

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
    // load commercetools data
    const { customer, cart, cartItems } = await getCustomerWithCart(request)

    if (!cart) {
      throw { message: "Cart information is missing or empty", statusCode: 400 }
    }

    const paymentConfig = await getCustomObjects()

    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }

    //TODO: If the guest user has a buyer saved as custom field in cart, then no need to create buyer.
    let gr4vyBuyerId = customer?.gr4vyBuyerId || cart.gr4vyBuyerId

    // create buyer in gr4vy if buyer id is not present
    if (!gr4vyBuyerId) {
      const { body: buyer } = await createBuyer({ customer, cart, paymentConfig })
      if (!buyer) {
        throw { message: "Error in creating buyer in CTP for customer", statusCode: 400 }
      }
      gr4vyBuyerId = buyer.id

      // Update CT customer and cart with buyer info
      if(customer) {
        const isCustomerCartUpdated = await updateCustomerCart({ customer, cart, buyer })
        if (!isCustomerCartUpdated) {
          throw {
            message: "Error in updating buyer id in CTP for registered customer and cart",
            statusCode: 400,
          }
        }

        // Set gr4vyBuyerId in customer
        customer.gr4vyBuyerId = {
          value: buyer.id,
        }
      }
      else {
        //Update Cart with buyer Id
        const isCartUpdated = await updateCart({cart, buyer})
        if(!isCartUpdated) {
          throw {
            message: "Error in updating buyer id in CTP for guest cart",
            statusCode: 400,
          }
        }

        // Set gr4vyBuyerId in customer
        cart.gr4vyBuyerId = {
          value: buyer.id,
        }
      }
    }

    // Omit specific keys
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKey, ...restConfig } = paymentConfig.value
    const embedToken = await createEmbedToken({ customer, cart, paymentConfig, cartItems })

    const { id, totalPrice, country } = cart

    const responseData = {
      cartFull: cart,
      embedToken,
      ...restConfig,
      cart: {
        id,
        totalPrice,
        country,
      },
      cartItems,
      gr4vyBuyerId: gr4vyBuyerId || null,
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
          message: e?.response?.body?.message || e.message,
        },
      ],
    })
  }
}

export default { processRequest }
