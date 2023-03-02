import { Gr4vy } from "../../../clients/gr4vyClient"
import { getCustomObjects } from "./../../commercetools/getCustomObjects"
import { PaymentConfig } from "./../../types"
export const getTransactionById = async (transactionId: string) => {
  const paymentConfig: PaymentConfig = await getCustomObjects()

  if (!paymentConfig) {
    throw { message: "Payment configuration is missing or empty", statusCode: 400 }
  }

  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const transaction = await gr4vy.getTransactionById(transactionId)
  return transaction
}
