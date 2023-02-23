import healthController from "./../api/health/health.controller"
import embedTokenController from "../api/getEmbedToken/embed.controller"
import updateBuyer from "./../api/updateBuyer/update.buyer.controller"
import keyUploadController from "../api/keyFileUpload/keyfileupload.controller"

const routes = {
  "/": healthController.processRequest,
  "/health": healthController.processRequest,
  "/embedToken": embedTokenController.processRequest,
  "/updateBuyer": updateBuyer.processRequest,
  "/key/upload": keyUploadController.processRequest
}

export { routes }
