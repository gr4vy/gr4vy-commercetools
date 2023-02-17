const responseMapper = async (result: any) => {
  return result?.body?.data || {}
}

export { responseMapper }
