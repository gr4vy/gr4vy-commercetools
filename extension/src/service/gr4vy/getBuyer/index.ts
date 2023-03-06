// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { PaymentConfig } from "./../../types"

export const getBuyer = async ({
    userId,
    paymentConfig}: {
        userId: string
        paymentConfig: PaymentConfig
    })  => {

    const { gr4vyId, privateKey } = paymentConfig.value || {}

    // Initialize gr4vy
    const gr4vy = new Gr4vy({
        gr4vyId,
        privateKey,
    })
    if(userId) {
        return gr4vy.listBuyer(userId)
    }
}