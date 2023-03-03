const responseMapper = async (result: any) => {
    return !!result?.body?.data?.updateCart?.id
  }

  export { responseMapper }