const responseMapper = (response: any) => {
  return response?.body?.data?.order || null
}

export { responseMapper }
