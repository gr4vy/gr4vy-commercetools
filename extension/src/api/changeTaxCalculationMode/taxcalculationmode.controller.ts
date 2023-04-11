import { ServerResponse } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "../../helper/response";

const logger = getLogger()

const processRequest = async (request: Request, response: ServerResponse) => {
  logger.debug("taxcalculationmode request body", request.body)

  ResponseHelper.setResponseToEmpty(response)
}

export default { processRequest }
