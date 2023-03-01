import { IncomingMessage, ServerResponse } from "http"
import { StatusCodes, getReasonPhrase } from "http-status-codes"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCustomObjects } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"

import {
  updateBuyerDetails,
  createBuyerShippingAddress,
  updateBuyerShippingAddress,
  updateCustomerCartAddress,
  getCustomerWithCartDetails
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

    const {updateBuyer, gr4vyBuyerId, updateShippingAddress, updateGr4vyReference} = await getCustomerWithCartDetails(request)

    const gr4vyId = gr4vyBuyerId.gr4vyBuyerId;

    // create buyer in gr4vy if buyer id is not present
    if (gr4vyId) {

      const paymentConfig = await getCustomObjects()

      if (!paymentConfig) {
        throw { message: "Payment configuration is missing or empty", statusCode: 400 }
      }

      // Update buyer details in Gr4vy
      const { body: buyer } = await updateBuyerDetails({ updateBuyer, gr4vyBuyerId , paymentConfig, updateGr4vyReference})
      if (!buyer) {
        throw { message: "Error in updating buyer in CTP for customer", statusCode: 400 }
      }

      let returnShippingDetail = {}

      if (updateShippingAddress.buyerShippingId) {
        //update buyer shipping address in Gr4vy
        const { body: shippingDetail } = await updateBuyerShippingAddress({updateShippingAddress, paymentConfig});
        updateGr4vyReference.addressDetailId = shippingDetail?.id
        returnShippingDetail = shippingDetail
      } else {
        //create buyer shipping address in Gr4vy
        const { body: shippingDetail } = await createBuyerShippingAddress({updateShippingAddress, paymentConfig});
        updateGr4vyReference.addressDetailId = shippingDetail?.id
        returnShippingDetail = shippingDetail
      }

      if (!returnShippingDetail) {
        throw { message: "Error in updating buyer shipping address in CTP for customer", statusCode: 400 }
      }

      if (updateGr4vyReference.addressId && updateGr4vyReference.addressDetailId) {
        //Update Shipping Detail ID into the Shipping Address of the CT customer
        const isUpdated = await updateCustomerCartAddress({updateGr4vyReference})

        if (!isUpdated) {
          throw {
            message: "Error in updating buyer shipping id in CTP for customer shipping address",
            statusCode: 400,
          }
        }
      }

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
