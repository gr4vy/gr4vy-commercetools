import { Order } from "./../../types"
// eslint-disable-next-line
const responseMapper = async (
  // eslint-disable-next-line
  result: any
): Promise<{
  order: Order
}> => {
  return result?.body?.data?.order || {}
}

export { responseMapper }
