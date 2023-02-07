import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { ApiClient } from "./../../service/commercetools/graphql"
import { getCustomerWithCart } from "./../../service/commercetools/getEmbedToken"

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
