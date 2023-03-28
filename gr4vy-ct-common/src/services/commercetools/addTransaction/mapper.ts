// eslint-disable-next-line
const responseMapper = (response: any):boolean => {
  return !!response?.body?.data?.updatePayment
}

export { responseMapper }
