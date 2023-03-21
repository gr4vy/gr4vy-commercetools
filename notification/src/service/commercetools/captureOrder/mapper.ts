// eslint-disable-next-line
const responseMapper = async (result: any) => {
  const errors = result?.body?.errors
  if (errors) {
    throw new Error(
      "There happened an error, while updating the order at Commercetools - " +
        JSON.stringify(errors)
    )
  }
  return !!result?.body?.data?.updatePayment?.id
}

export { responseMapper }
