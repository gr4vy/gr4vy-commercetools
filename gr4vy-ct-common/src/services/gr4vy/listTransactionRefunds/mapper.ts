import { RefundItems } from "./types"

const responseMapper = (response: any): RefundItems => {
  return response?.body || null
}

export { responseMapper }
