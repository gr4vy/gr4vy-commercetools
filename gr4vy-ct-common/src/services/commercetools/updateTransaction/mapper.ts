import { hasErrorDueConcurrentModification } from "../../../helpers"

// eslint-disable-next-line
const responseMapper = (response: any): boolean => {
  // Find error is due to Concurrent Modification
  const hasErrDueConcurrentModification = hasErrorDueConcurrentModification(response)
  const shouldThrowErrors = !!response?.body?.errors?.length && !hasErrDueConcurrentModification

  if (shouldThrowErrors) {
    throw {
      // eslint-disable-next-line
      message: response?.body?.errors.map((e: any) => {
        return {
          description: e.message,
        }
      }),
      statusCode: 400,
    }
  }

  return { ...response?.body?.data?.updatePayment, hasErrDueConcurrentModification }
}

export { responseMapper }
