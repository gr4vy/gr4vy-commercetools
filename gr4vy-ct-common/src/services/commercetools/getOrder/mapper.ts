const responseMapper = (response: any) => {
  return response?.body?.data?.me?.order || null
}

export { responseMapper }
