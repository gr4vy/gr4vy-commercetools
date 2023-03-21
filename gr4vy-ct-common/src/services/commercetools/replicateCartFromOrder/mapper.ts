// eslint-disable-next-line
const responseMapper = (response: any) => {
  return response?.body?.data?.replicateCart || null
}

export { responseMapper }
