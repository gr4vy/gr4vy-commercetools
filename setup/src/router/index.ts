import healthController from "./../api/health/health.controller"

const routes = {
  "/": healthController.processRequest,
}

export { routes }
