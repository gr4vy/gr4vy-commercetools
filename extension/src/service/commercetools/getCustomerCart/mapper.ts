const responseMapper = async (result: any) => {
  return result?.body?.data?.me || {}
}

export { responseMapper }
