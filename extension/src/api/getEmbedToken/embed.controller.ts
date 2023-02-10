import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getCustomerWithCart } from "../../service/commercetools/getCustomerCart"

const processRequest = async (request: IncomingMessage, response: ServerResponse) => {
  try {
    if (!isPostRequest(request)) {
      return ResponseHelper.setResponseError(response, {
        statusCode: StatusCodes.BAD_REQUEST,
        message: getReasonPhrase(StatusCodes.BAD_REQUEST),
      })
    }

    // get customer and cart (me api's)
    const apiClient = new ApiClient()
    apiClient.setBody({
      query: getCustomerWithCart,
    })
    const result = await apiClient.get()

    ResponseHelper.setResponseTo200(response, result)
  } catch (e) {
    //ResponseHelper.setResponseError(response, {})
  }
}

export default { processRequest }
