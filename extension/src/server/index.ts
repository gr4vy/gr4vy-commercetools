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
        const headers = {
          "Access-Control-Allow-Origin": process.env.APP_CORS_ALLOWED_HOSTS,
          "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
          "Access-Control-Max-Age": 2592000, // 30 days
        };

        if (request.method === "OPTIONS") {
          response.writeHead(204, headers);
          response.end();
          return;
        }

        response.writeHead(200, headers);
        response.end();
        return;

      } else {
        ResponseHelper.setResponseError(response, {
          httpStatusCode: StatusCodes.NOT_FOUND,
          message: "Route not found",
        })
      }
    } catch (e) {
      logger.error(e, `Unexpected error when processing URL ${request.url}`)
      ResponseHelper.setResponseError(response, {
        httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: e.message,
      })
    }
  })
}

export { createServer }
