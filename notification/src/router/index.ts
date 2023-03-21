import healthController from "./../api/health/health.controller"
import transactionCaptureController from "../api/transactionCapture/transactioncapture.controller"
import transactionRefundController from "../api/transactionRefund/transactionrefund.controller"
import transactionVoidController from "./../api/transactionVoid/transactionvoid.controller"

const routes = {
  "/": healthController.processRequest,
  "/transactioncapture": transactionCaptureController.processRequest,
  "/transactionrefund": transactionRefundController.processRequest,
  "/transactionvoid": transactionVoidController.processRequest,
}

export { routes }
