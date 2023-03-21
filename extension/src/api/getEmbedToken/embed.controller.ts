import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import {
  getCustomerWithCart,
  createBuyer,
  updateMyCustomerCart,
  createEmbedToken,
  updateMyCart,
  getBuyer,
} from "../../service"
import { getLogger } from "./../../utils"

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

    let gr4vyBuyerId = customer?.gr4vyBuyerId ?? cart.gr4vyBuyerId

    // create buyer in gr4vy if buyer id is not present
    if (!gr4vyBuyerId) {
      //if there is no gr4vy buyer Id against cart or customer, see if it is there in Gr4vy.
      const userId = customer?.id ?? cart.anonymousId
      const {
        body: { items },
      } = await getBuyer({ userId, paymentConfig })

      let buyer
      if (items.length == 0) {
        const { body } = await createBuyer({ customer, cart, paymentConfig })
        buyer = body
        if (!buyer) {
          throw { message: "Error in creating buyer in CTP for customer", statusCode: 400 }
        }
      } else {
        buyer = items[0]
      }

      // Update CT customer and cart with buyer info
      if (customer) {
        const isMyCustomerCartUpdated = await updateMyCustomerCart({
          request,
          customer,
          cart,
          buyer,
        })
        if (!isMyCustomerCartUpdated) {
          throw {
            message: "Error in updating buyer id in CTP for registered customer and cart",
            statusCode: 400,
          }
        }

        // Set gr4vyBuyerId in customer
        customer.gr4vyBuyerId = {
          value: buyer.id,
        }
        gr4vyBuyerId = customer.gr4vyBuyerId
      } else {
        //Update Cart with buyer Id
        const isMyCartUpdated = await updateMyCart({ request, cart, buyer })
        if (!isMyCartUpdated) {
          throw {
            message: "Error in updating buyer id in CTP for guest cart",
            statusCode: 400,
          }
        }

        // Set gr4vyBuyerId in customer
        cart.gr4vyBuyerId = {
          value: buyer.id,
        }

        gr4vyBuyerId = cart.gr4vyBuyerId
      }
    }

    // Omit specific keys
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { privateKey, ...restConfig } = paymentConfig
    const embedToken: string = await createEmbedToken({ customer, cart, paymentConfig, cartItems })

    //TBD: If the embedToken generation fails maybe the buyer need to be created.

    const {
      totalPrice: { centAmount, currencyCode },
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
