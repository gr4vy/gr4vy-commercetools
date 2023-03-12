const responseMapper = async (result: any) => {
  return !!result?.body?.data?.updateMyCustomer?.id && !!result?.body?.data?.updateMyCart?.id
}

export { responseMapper }
