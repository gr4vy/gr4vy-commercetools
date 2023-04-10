import http, { ServerResponse } from "http"
import url from "url"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger } from "@gr4vy-ct/common"
import { StatusCodes } from "http-status-codes"

import { routes } from "./../router"
import ResponseHelper from "./../helper/response"
import cors from "../helper/headers"
import { Request } from "./../types"

const createServer = () => {
  return http.createServer(async (request: Request, response: ServerResponse) => {
    const logger = getLogger()
    try {
      const requestUrl = request.url || "/"
      const parts = url.parse(requestUrl)
      const route = routes[parts.pathname as keyof typeof routes]

      if (route) {
        if (request.method === "OPTIONS") {
          response.writeHead(204, cors())
          response.end()
          return
        }

        if (request.method === "POST") {
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
      logger.error(e, `Unexpected error when processing URL ${request.url}`)
      ResponseHelper.setResponseError(response, {
        httpStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: e.message,
      })
    }
  })
}

export { createServer }
