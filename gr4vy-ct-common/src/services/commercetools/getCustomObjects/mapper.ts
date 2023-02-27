import c from "../../../config/constants"

const responseMapper = (response: any) => {
  const parsedRes = response?.body?.data?.customObjects || {}
  return parsedRes.results.find(
    (e: { container: string }) => e.container === c.CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER
  )
}

export { responseMapper }
