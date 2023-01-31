import http, { IncomingMessage, ServerResponse } from "http"
import url from "url"

import { StatusCodes } from "http-status-codes"

import { getLogger } from "./../utils"
import { routes } from "./../router"
import ResponseHelper from "./../helper/response"

const logger = getLogger()

const createServer = () => {
  return http.createServer(async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const requestUrl = request.url || "/"
      const parts = url.parse(requestUrl)
      const route = routes[parts.pathname as keyof typeof routes]

      if (route) {
        await route(request, response)
      } else {
        ResponseHelper.setResponseError(response, {
          statusCode: StatusCodes.NOT_FOUND,
          message: "Route not found",
        })
      }
    } catch (e) {
      logger.error(e, `Unexpected error when processing URL ${request.url}`)
      ResponseHelper.setResponseError(response, {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: e.message,
      })
    }
  })
}

export { createServer }
