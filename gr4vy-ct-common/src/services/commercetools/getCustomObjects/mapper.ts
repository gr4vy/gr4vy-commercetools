
import { Constants } from "../../../config"
import { PaymentConfig } from '../../types'

// import { phone } from 'phone'

const responseMapper = (response: any): PaymentConfig => {
  const parsedRes = response?.body?.data?.customObjects || {}
  const result:PaymentConfig = parsedRes.results.find(
    (e: { container: string }) => e.container === Constants.CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER
  )
  //TBD: parse the configuration and cast to type.
  // const config = JSON.parse(result.value);
  cleanup(result)
  return result;
}

const cleanup = (result: PaymentConfig) => {
  result.value.metadata = result.value?.metadata??'default';
  //TBD: validate phone number.
  //validate phone number in statement descriptor
  // const statementDescriptor = JSON.parse(result.value?.statementDescriptor);

  // const phoneNumber = result.value?.statementDescriptor?.phonenumber
}

export { responseMapper }
