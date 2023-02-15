const KEY_GR4VY_PAYMENT_CONFIG = "key:gr4vy-payment-configuration"

const getGr4vyPaymentConfigCacheKey = () =>
  `${process.env.CTP_PROJECT_KEY}_${KEY_GR4VY_PAYMENT_CONFIG}`

export default {
  getGr4vyPaymentConfigCacheKey,
}
