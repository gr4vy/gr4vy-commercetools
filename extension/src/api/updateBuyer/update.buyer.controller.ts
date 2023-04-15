import { ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger, getCustomObjects } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import {
  updateBuyerDetails,
  updateCustomerCartAddress,
  manageBuyerShippingAddress,
  getCustomerWithCart,
} from "../../service"
import { getBuyer } from "./../../utils"

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
    const { locale } = request.body
    //Get Active customer cart details
    const { customer, cart } = await getCustomerWithCart(request, locale)

    const paymentConfig = await getCustomObjects()
    if (!paymentConfig) {
      throw { message: "Payment configuration is missing or empty", statusCode: 400 }
    }

    const gr4vyBuyer = await getBuyer({ customer, cart, paymentConfig })
    if (gr4vyBuyer) {
      if (customer) customer.gr4vyBuyerId = {value: gr4vyBuyer.id};
      if (cart) cart.gr4vyBuyerId = {value: gr4vyBuyer.id};
      // Update buyer details in Gr4vy
      const { body: buyer } = await updateBuyerDetails({ customer, cart, paymentConfig })
      if (!buyer) {
        throw { message: "Error in updating buyer in CTP for customer", statusCode: 400 }
      }

      //Create OR Update the Buyer Shipping Address
      const { body: shippingDetail } = await manageBuyerShippingAddress({
        customer,
        cart,
        paymentConfig,
      })

      if (!shippingDetail) {
        throw {
          message: "Error in updating buyer shipping address in CTP for customer",
          statusCode: 400,
        }
      }

      //return data to be used by onBeforeTransaction of Embed.
      const responseData = {
        shippingDetailsId: shippingDetail?.id
      }

      ResponseHelper.setResponseTo200(response, responseData)
    } else {
      throw { message: "Buyer ID is missing in Gr4vy", statusCode: 400 }
    }
  } catch (e) {
    const errorStackTrace =
      `Error updating buyer details in gr4vy request: Ending the process. ` +
      `Error: ${JSON.stringify(e)}`
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
