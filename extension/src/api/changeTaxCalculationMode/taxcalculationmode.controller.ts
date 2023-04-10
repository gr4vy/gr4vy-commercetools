import { ServerResponse } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Request } from "./../../types"
import { getLogger } from "./../../utils"

const logger = getLogger()

const processRequest = async (request: Request, response: ServerResponse) => {
  logger.debug(`changeTaxcalculationMode:: createCartResponse `, JSON.stringify(request))

}

export default { processRequest }
