import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import {
  getCustomObjects,
  getOrder,
  updateBuyerDetails,
  createBuyerShippingAddress,
  updateBuyerShippingAddress,
  updateCustomerOrder,
  updateCustomerAddressOrderWithAddress
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

    const {updateBuyer, gr4vyBuyerId, updateShippingAddress, updateGr4vyReference} = await getOrder()
    //const order = await getOrder()

    const gr4vyId = gr4vyBuyerId.gr4vyBuyerId;

    // create buyer in gr4vy if buyer id is not present
    if (gr4vyId) {

      const paymentConfig = await getCustomObjects()

      if (!paymentConfig) {
        throw { message: "Payment configuration is missing or empty", statusCode: 400 }
      }

      // Update buyer details in Gr4vy
      /*const { body: buyer } = await updateBuyerDetails({ updateBuyer, gr4vyBuyerId , paymentConfig})
      if (!buyer) {
        throw { message: "Error in updating buyer in CTP for customer", statusCode: 400 }
      }*/

      const buyerShippingId = ''
      const shippingDetail = {}
      const returnCustomer = {}

      if (buyerShippingId) {
        //update buyer shipping address in Gr4vy
        //const { body: shippingDetail } = await updateBuyerShippingAddress({updateShippingAddress, paymentConfig});
      } else {
        //create buyer shipping address in Gr4vy
        //const { body: shippingDetail } = await createBuyerShippingAddress({updateShippingAddress, paymentConfig});
        updateGr4vyReference.addressDetailId = "\"dsdsd-test-test\""//shippingDetail?.id
        updateGr4vyReference.gr4vyBuyerId =  "\"31b6f0ea-8b3d-4c92-864c-f0529b0ac2d9\""
      }

      if (updateGr4vyReference.addressId) {
        //Update Shipping Detail ID into the Shipping Address of the CT customer // Update Buyer ID in Order Object
        const isUpdated = await updateCustomerAddressOrderWithAddress({updateGr4vyReference})
      } else {
        const isUpdated = await updateCustomerOrder({updateGr4vyReference})
      }

      if (!shippingDetail) {
        throw { message: "Error in updating buyer address in CTP for customer", statusCode: 400 }
      }


      ResponseHelper.setResponseTo200(response, { returnCustomer})
    } else {
      throw { message: "Buyer ID is missing in order data", statusCode: 400 }
    }
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
