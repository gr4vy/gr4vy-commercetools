import { Order } from "../../types"

const responseMapper = (response: any): Order => {
  return response?.body?.data?.order || null
}

export { responseMapper }
