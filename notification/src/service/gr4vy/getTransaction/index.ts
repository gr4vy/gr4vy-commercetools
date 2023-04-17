// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Gr4vy } from "@gr4vy-ct/common"

import { PaymentConfig } from "./../../types"

export const getTransaction = async ({
    orderId,
    paymentConfig}: {
        orderId: string
        paymentConfig: PaymentConfig
    })  => {

    const { gr4vyId, privateKey } = paymentConfig || {}

    // Initialize gr4vy
    const gr4vy = new Gr4vy({
        gr4vyId,
        privateKey,
        debug: paymentConfig?.debug ? true : false
    })
    const {
        body: { items },
        } = await  gr4vy.listTransaction(orderId)
    return items.length > 0 ? items[0] : null
}