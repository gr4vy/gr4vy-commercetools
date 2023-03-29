import { phone } from "phone"

import { Constants } from "../../../config"
import { PaymentConfig, PaymentConfigContainer } from "../../types"
// eslint-disable-next-line
const responseMapper = (response: any): PaymentConfig => {
  const parsedRes = response?.body?.data?.customObjects || {}
  const result: PaymentConfigContainer = parsedRes.results.find(
    (e: { container: string }) =>
      e.container === Constants.CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER
  )
  //parse the configuration and cast to type.
  const config: PaymentConfig = JSON.parse(JSON.stringify(result.value)) as PaymentConfig
  cleanup(config)
  return config
}

const cleanup = (config: PaymentConfig) => {

  //validate if metadata config has a valid json string. otherwise use default.
  let metadata = { ct_custom_data: "default" };
  if(config?.customData) {
    try {
      metadata = JSON.parse(config?.customData);
    }
    catch(e) {
      console.log("Error parsing meta data.", config?.customData);
    }
  }
  config.metadata = metadata;

  //validate phone number in statement descriptor
  const phoneNumber = config?.statementDescriptor?.phoneNumber

  if (phoneNumber) {
    const validatePhoneNumber = phone(phoneNumber)
    if (config.statementDescriptor && validatePhoneNumber.isValid) {
      config.statementDescriptor.phoneNumber = validatePhoneNumber.phoneNumber
    } else {
      delete config.statementDescriptor?.phoneNumber
    }
  }
}

export { responseMapper }
