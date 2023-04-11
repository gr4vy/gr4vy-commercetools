// eslint-disable-next-line
const responseMapper = (response: any) => {
  checkResponseError(response)
  return !!response?.body?.data?.updateOrder && !!response?.body?.data?.updatePayment
}

const responseMapperWithoutTransaction = (response: any) => {
  checkResponseError(response)
  return !!response?.body?.data?.updateOrder
}

const checkResponseError = (response: any) => {
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
}

export { responseMapper, responseMapperWithoutTransaction }
