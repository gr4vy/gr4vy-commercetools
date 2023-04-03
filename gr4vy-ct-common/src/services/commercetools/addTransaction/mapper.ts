// eslint-disable-next-line
const responseMapper = (response: any):boolean => {
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
  return !!response?.body?.data?.updatePayment
}

export { responseMapper }
