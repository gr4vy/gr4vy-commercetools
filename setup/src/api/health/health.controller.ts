import { IncomingMessage, ServerResponse } from "http"

import ResponseHelper from "./../../helper/response"

const processRequest = (_request: IncomingMessage, response: ServerResponse) => {
  ResponseHelper.setResponseTo200(response, { commitId: "" })
}

export default { processRequest }
