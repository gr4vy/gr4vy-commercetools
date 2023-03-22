// eslint-disable-next-line
const responseMapper = (response: any) => {
  if (response?.body?.errors) {
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
  return (
    !!response?.body?.data?.changeOrderState &&
    !!response?.body?.data?.changePaymentState &&
    !!response?.body?.data?.changeTransactionState
  )
}

export { responseMapper }
