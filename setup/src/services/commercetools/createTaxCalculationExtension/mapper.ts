const responseMapper = (response: any) => {
  if (response?.body?.errors) {
    throw {
      message: response?.body?.errors.map((e: any) => {
        return {
          description: e.message,
        }
      }),
      statusCode: 400,
    }
  }
  return (
      !!response?.body?.data?.extension
  )
}

export { responseMapper }