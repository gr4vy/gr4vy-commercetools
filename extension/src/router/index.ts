import healthController from "./../api/health/health.controller"
import embedTokenController from "../api/getEmbedToken/embed.controller"
import updateBuyer from "./../api/updateBuyer/update.buyer.controller"
import keyUploadController from "../api/keyFileUpload/keyfileupload.controller"
import updatePaymentController from "../api/updatePayment/payment.controller"
import replicateCartController from "../api/replicateCart/replicateCart.controller"
import webhookOrder from "../api/webhookOrder/order.controller"
import clearCacheController from "../api/clearCache/cache.controller"
import taxcalculationController from "../api/changeTaxCalculationMode/taxcalculationmode.controller"

const routes = {
  "/": healthController.processRequest,
  "/health": healthController.processRequest,
  "/embedToken": embedTokenController.processRequest,
  "/updateBuyer": updateBuyer.processRequest,
  "/key/upload": keyUploadController.processRequest,
  "/updatePayment": updatePaymentController.processRequest,
  "/replicateCart": replicateCartController.processRequest,
  "/webhookOrder": webhookOrder.processRequest,
  "/cache/clear": clearCacheController.processRequest,
  "/taxcalculationmode": taxcalculationController.processRequest,
}

export { routes }
