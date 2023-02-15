const responseMapper = async (result: any) => {
  const e = await result
  return e?.body?.data?.me || {}
}

export { responseMapper }
