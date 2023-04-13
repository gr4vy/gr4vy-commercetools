import { hasErrorDueConcurrentModification } from "../../../helpers"
import { UpdateOrderWithPaymentResponse } from "./../../types"

const responseMapper = async (result: any): Promise<UpdateOrderWithPaymentResponse> => {
  // Find error is due to Concurrent Modification
  const hasErrDueConcurrentModification = hasErrorDueConcurrentModification(result)
  const shouldThrowErrors = !!result?.body?.errors?.length && !hasErrDueConcurrentModification

  if (shouldThrowErrors) {
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
    hasErrDueConcurrentModification,
    hasOrderWithPaymentUpdated:
      !!result?.body?.data?.updateOrder?.id && !!result?.body?.data?.updatePayment?.id,
    updateOrder: result?.body?.data?.updateOrder,
    updatePayment: result?.body?.data?.updatePayment,
  }
}

export { responseMapper }
