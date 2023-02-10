import { IncomingMessage, ServerResponse } from "http"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient } from "@gr4vy-ct/common"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getCustomerWithCart } from "../../service/commercetools/getCustomerCart"
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

    // TODO: need to initialize in global
    const apiClient: ApiClient = new ApiClient({
      authHost: process.env.CTP_AUTH_URL,
      apiHost: process.env.CTP_API_URL,
      projectKey: process.env.CTP_PROJECT_KEY,
      clientId: process.env.CTP_CLIENT_ID,
      clientSecret: process.env.CTP_CLIENT_SECRET,
      scopes: process.env.CTP_SCOPES,
    })

    apiClient.setAuthorizationBearerHeader(bearerToken)
    // Get customer and cart from commercetools
    apiClient.setBody({
      query: getCustomerWithCart,
    })
    const customerWithCartInfo = await apiClient.execute()

    ResponseHelper.setResponseTo200(response, customerWithCartInfo)
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
