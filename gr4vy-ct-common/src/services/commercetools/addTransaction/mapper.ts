import { Payment } from "@commercetools/platform-sdk"

import { hasErrorDueConcurrentModification } from "../../../helpers"

const responseMapper = (
  response: any
): Promise<
  Payment & {
    hasErrDueConcurrentModification: boolean
  }
> => {
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
