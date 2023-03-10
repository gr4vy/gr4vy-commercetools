const responseMapper = async (result: any) => {
    return !!result?.body?.data?.updateMyCart?.id
  }

  export { responseMapper }