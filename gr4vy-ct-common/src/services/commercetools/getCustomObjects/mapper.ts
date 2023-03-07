
import c from "../../../config/commonconstants"
import { PaymentConfig } from '../../types'

const responseMapper = (response: any): PaymentConfig => {
  const parsedRes = response?.body?.data?.customObjects || {}
  const result:PaymentConfig = parsedRes.results.find(
    (e: { container: string }) => e.container === c.CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER
  )
  cleanup(result)
  return result;
}

const cleanup = (result: PaymentConfig) => {
  result.value.metadata = result.value?.metadata??'default';
}

export { responseMapper }
