import { RefundItems } from "./../../types"

const responseMapper = (response: any): Promise<{ items: RefundItems }> => {
  return response?.body || null
}

export { responseMapper }
