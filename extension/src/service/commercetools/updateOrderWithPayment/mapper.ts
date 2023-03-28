const responseMapper = async (result: any): Promise<boolean> => {
  if (result?.body?.errors) {
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
  return !!result?.body?.data?.updateOrder?.id && !!result?.body?.data?.updatePayment?.id
}

export { responseMapper }
