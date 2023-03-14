const responseMapper = (response: any) => {
  if (response?.body?.errors) {
    throw {
      message: response?.body?.errors.map((e: any) => {
        console.log(e.message)
        return {
          description: e.message,
        }
      }),
      statusCode: 400,
    }
  }
  return (
      response?.body?.data?.createSubscription1
  )
}

export { responseMapper }