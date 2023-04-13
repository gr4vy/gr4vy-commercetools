// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { hasErrorDueConcurrentModification } from "@gr4vy-ct/common"

// eslint-disable-next-line
const responseMapper = async (result: any) => {
  // Find error is due to Concurrent Modification
  const hasErrDueConcurrentModification = hasErrorDueConcurrentModification(result)
  const shouldThrowErrors = !!result?.body?.errors?.length && !hasErrDueConcurrentModification

  if (shouldThrowErrors) {
    const errors = result?.body?.errors
    throw new Error(
      "There happened an error, while updating the order at Commercetools - " +
        JSON.stringify(errors)
    )
  }
  return { ...result?.body?.data?.updateOrder, hasErrDueConcurrentModification }
}

export { responseMapper }
