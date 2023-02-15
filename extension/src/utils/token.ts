import { IncomingMessage } from "http"

const getAuthorizationRequestHeader = (request: IncomingMessage) => {
  return request?.headers?.["authorization"]
}

export { getAuthorizationRequestHeader }
