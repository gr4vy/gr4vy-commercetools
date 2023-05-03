import { Gr4vy } from "../../../clients/gr4vyClient"
import { getCustomObjects } from "./../../commercetools/getCustomObjects"
import { PaymentConfig } from "./../../types"
import { responseMapper } from "./mapper"

export const listTransactionRefunds = async (transactionId: string) => {
  const paymentConfig: PaymentConfig = await getCustomObjects()

  if (!paymentConfig) {
    throw { message: "Payment configuration is missing or empty", statusCode: 400 }
  }

  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: !!paymentConfig?.debug,
  })

  return responseMapper(await gr4vy.listTransactionRefunds(transactionId))
}
