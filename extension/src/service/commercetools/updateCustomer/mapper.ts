const responseMapper = async (result: any) => {
  return !!result?.body?.data?.updateCustomer?.id
}

export { responseMapper }
