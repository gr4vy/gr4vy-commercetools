import { UpdateOrderWithPaymentResponse } from "./../../types"
const responseMapper = async (result: any): Promise<UpdateOrderWithPaymentResponse> => {
  if (result?.body?.errors) {
    throw {
      // eslint-disable-next-line
      message: result?.body?.errors.map((e: any) => {
        return {
          description: e.message,
          path: e.path,
        }
      }),
      statusCode: 400,
    }
  }
  return {
    hasOrderWithPaymentUpdated:
      !!result?.body?.data?.updateOrder?.id && !!result?.body?.data?.updatePayment?.id,
    updateOrder: result?.body?.data?.updateOrder,
    updatePayment: result?.body?.data?.updatePayment,
  }
}

export { responseMapper }
