import { IncomingMessage, ServerResponse } from "http"
import fs from "fs"
import path from "path"

import { StatusCodes, getReasonPhrase } from "http-status-codes"
import formidable from "formidable"

import ResponseHelper from "./../../helper/response"
import { isPostRequest } from "./../../helper/methods"
import { getLogger } from "./../../utils"

const processRequest = async (request: IncomingMessage, response: ServerResponse) => {
  const logger = getLogger()
  if (!isPostRequest(request)) {
    logger.debug(`Received non-POST request: ${request.method}. The request will not be processed!`)
    return ResponseHelper.setResponseError(response, {
      httpStatusCode: StatusCodes.BAD_REQUEST,
      errors: [
        {
          code: StatusCodes.BAD_REQUEST,
          message: getReasonPhrase(StatusCodes.BAD_REQUEST),
        },
      ],
    })
  }

  try {
    const form = new formidable.IncomingForm()
    form.parse(request, function (err, fields, files: any) {
      if (err || !files.file || !files.file?.filepath) {
        return ResponseHelper.setResponseError(response, {
          httpStatusCode: 400,
          errors: [
            {
              code: 400,
              message: err?.message || "File path not found",
            },
          ],
        })
      }
      const oldPath = files.file.filepath
      const newPath = process.env.GR4VY_PRIVATE_KEY_PATH + files.file.originalFilename
      const rawData = fs.readFileSync(oldPath)

      fs.writeFile(newPath, rawData, function (err) {
        if (err) {
          return ResponseHelper.setResponseError(response, {
            httpStatusCode: 500,
            errors: [
              {
                code: 500,
                message: err?.message || "Failed to upload file",
              },
            ],
          })
        }
        ResponseHelper.setResponseTo200(response, { newPath: path.basename(newPath) })
      })
    })
  } catch (e) {
    ResponseHelper.setResponseError(response, {
      httpStatusCode: 500,
      errors: [
        {
          code: 500,
          message: e.message,
        },
      ],
    })
  }
}

export default { processRequest }
