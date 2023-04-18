import http, { ServerResponse } from "http"
import url from "url"

import { StatusCodes } from "http-status-codes"
import { getLogger } from "@gr4vy-ct/common"

import { routes } from "./../router"
import ResponseHelper from "./../helper/response"
import cors from "../helper/headers"
import { Request } from "./../types"
import { isPostRequest, isMultiPartRequest, isOptionsRequest } from "./../helper"

const createServer = () => {
  return http.createServer(async (request: Request, response: ServerResponse) => {
    const logger = getLogger()
    try {
      const requestUrl = request.url || "/"
      const parts = url.parse(requestUrl)
      const route = routes[parts.pathname as keyof typeof routes]

      if (route) {
        if (isOptionsRequest(request)) {
          response.writeHead(204, cors())
          response.end()
          return
        }
        if (isPostRequest(request) && !isMultiPartRequest(request)) {
          let chunks = ""
          request.on("data", chunk => {
            chunks += chunk
          })
          request.on("end", async () => {
            try {
              request.body = JSON.parse(chunks)
            } catch (err) {
              request.body = {}
            }
            await route(request, response)
          })
        } else {
          await route(request, response)
        }
      } else {
        ResponseHelper.setResponseError(response, {
          httpStatusCode: StatusCodes.NOT_FOUND,
          message: "Route not found",
        })
      }
    } catch (e) {
      logger.debug(e, `Unexpected error when processing URL ${request.url}`)
      ResponseHelper.setResponseError(response, {
        httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: e.message,
      })
    }
  })
}

export { createServer }
