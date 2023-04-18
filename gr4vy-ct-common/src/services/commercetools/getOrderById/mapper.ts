import { Order } from "@commercetools/platform-sdk"

const responseMapper = async (result: any): Promise<Order> => {
  return result?.body?.data?.order || {}
}

export { responseMapper }
