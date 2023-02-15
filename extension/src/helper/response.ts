import { ServerResponse } from "http"

import { StatusCodes } from "http-status-codes"

class ResponseHelper {
  headers = {
    "Content-Type": "application/json",
  }

  constructor() {
    //TODO: logging
  }

  setResponseTo200<T>(response: ServerResponse, params?: T) {
    response.writeHead(StatusCodes.OK, this.headers)
    response.end(
      JSON.stringify({
        statusCode: StatusCodes.OK,
        result: params,
      })
    )
  }

  setResponseTo201<T>(response: ServerResponse, params?: T) {
    response.writeHead(StatusCodes.CREATED, this.headers)
    response.end(
      JSON.stringify({
        statusCode: StatusCodes.CREATED,
        result: params,
      })
    )
  }

  setResponseError(
    response: ServerResponse,
    params: { httpStatusCode: number; message?: string; errors?: [{ code: string | number; message: string }] }
  ) {
    const { httpStatusCode, message, errors } = params
    response.writeHead(httpStatusCode, this.headers)
    response.end(
      JSON.stringify({
        status:"nok",
        message,
        errors,
      })
    )
  }
}

export default new ResponseHelper()
