import healthController from "./../api/health/health.controller"
import embedTokenController from "../api/getEmbedToken/embed.controller"
import keyUploadController from "../api/keyFileUpload/keyfileupload.controller"
import updatePaymentController from "../api/updatePayment/payment.controller"
import replicateCartController from "../api/replicateCart/replicateCart.controller"

const routes = {
  "/": healthController.processRequest,
  "/health": healthController.processRequest,
  "/embedToken": embedTokenController.processRequest,
  "/key/upload": keyUploadController.processRequest,
  "/updatePayment": updatePaymentController.processRequest,
  "/replicateCart": replicateCartController.processRequest,
}

export { routes }
