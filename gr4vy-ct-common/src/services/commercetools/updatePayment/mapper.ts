const responseMapper = (response: any) => {
  return response?.body?.data?.updatePayment || {}
}

export { responseMapper }
