const responseMapper = (response: any) => {
  return response?.body?.data?.me?.order || {}
}

export { responseMapper }
