import { ServerResponse } from "http"

import { StatusCodes } from "http-status-codes"

import cors from "./headers"

class ResponseHelper {
  headers = {
    "Content-Type": "application/json",
  }

  constructor() {
    //TODO: logging
  }

  setResponseTo200<T>(response: ServerResponse, params?: T) {
    response.writeHead(StatusCodes.OK, {
      ...this.headers,
      ...cors(),
    })
    response.end(
      JSON.stringify({
        statusCode: StatusCodes.OK,
        result: params,
      })
    )
  }

  setResponseTo201<T>(response: ServerResponse, params?: T) {
    response.writeHead(StatusCodes.CREATED, {
      ...this.headers,
      ...cors(),
    })
    response.end(
      JSON.stringify({
        statusCode: StatusCodes.CREATED,
        result: params,
      })
    )
  }

  setResponseError(
    response: ServerResponse,
    params: {
      httpStatusCode: number
      message?: string
      errors?: [{ code: string | number; message: string }]
    }
  ) {
    const { httpStatusCode, message, errors } = params
    response.writeHead(httpStatusCode, {
      ...this.headers,
      ...cors(),
    })
    response.end(
      JSON.stringify({
        status: "nok",
        message,
        errors,
      })
    )
  }

  setResponseToEmpty<T>(response: ServerResponse) {
    response.writeHead(StatusCodes.OK, {
      ...this.headers,
      ...cors(),
    })
    response.end()
  }
}

export default new ResponseHelper()
