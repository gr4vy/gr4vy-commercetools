import { IncomingMessage } from "http"

const isPostRequest = (request: IncomingMessage) => request.method === "POST"
const isGetRequest = (request: IncomingMessage) => request.method === "GET"

export { isPostRequest, isGetRequest }
