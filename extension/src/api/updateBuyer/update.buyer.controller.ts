import { IncomingMessage, ServerResponse } from "http"
import { StatusCodes, getReasonPhrase } from "http-status-codes"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"

import {
  updateBuyerDetails,
  updateCustomerCartAddress,
  manageBuyerShippingAddress,
  getCustomerWithCart
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
    //Get Active customer cart details
    const {customer, cart} = await getCustomerWithCart(request)
    if (cart?.gr4vyBuyerId?.value) {
      const paymentConfig = await getCustomObjects()

      if (!paymentConfig) {
        throw { message: "Payment configuration is missing or empty", statusCode: 400 }
      }

      // Update buyer details in Gr4vy
      const { body: buyer } = await updateBuyerDetails({ customer, cart , paymentConfig})
      if (!buyer) {
        throw { message: "Error in updating buyer in CTP for customer", statusCode: 400 }
      }

      //Create OR Update the Buyer Shipping Address
      const { body: shippingDetail } = await manageBuyerShippingAddress({customer, cart, paymentConfig});

      if (!shippingDetail) {
        throw { message: "Error in updating buyer shipping address in CTP for customer", statusCode: 400 }
      }

      if (shippingDetail?.id && cart.shippingAddress?.id) {
        if (!cart?.shippingAddress?.gr4vyShippingDetailId?.value) {
          cart.gr4vyShippingDetailId = shippingDetail.id
        }

        //Update Shipping Detail ID into the Shipping Address of the CT customer
        const isUpdated = await updateCustomerCartAddress({customer, cart, paymentConfig})

        if (!isUpdated) {
          throw {
            message: "Error in updating buyer shipping id in CTP for customer shipping address",
            statusCode: 400,
          }
        }
      }


      // create buyer in gr4vy if buyer id is not present
      ResponseHelper.setResponseTo200(response, 'Successfully Updated the Buyer Details')
    } else {
      throw { message: "Buyer ID is missing in order data", statusCode: 400 }
    }
  } catch (e) {
    const errorStackTrace =
        `Error updating buyer details in gr4vy request: Ending the process. ` +
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
