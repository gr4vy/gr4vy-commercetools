import { ServerResponse } from "http"

import { getLogger } from "@gr4vy-ct/common"

import { Request } from "./../../types"
import ResponseHelper from "../../helper/response"

const processRequest = async (request: Request, response: ServerResponse) => {
  const logger = getLogger()
  logger.debug("taxcalculationmode request body", request.body)
  const updateCartResponseData = {
    actions: [{ action: "changeTaxCalculationMode", taxCalculationMode: "UnitPriceLevel" }],
  }
  ResponseHelper.setResponse(response, updateCartResponseData)
}

export default { processRequest }
