// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Gr4vy } from "@gr4vy-ct/common"

import {UpdateBuyerQuery} from "./../../types"

export const manageBuyerShippingAddress = async ({ cart, paymentConfig }: UpdateBuyerQuery) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const updateShippingAddress = {
    'emailAddress': cart?.shippingAddress?.email,
    'firstName': cart?.shippingAddress?.firstName,
    'lastName': cart?.shippingAddress?.lastName,
    'phoneNumber': cart?.shippingAddress?.phone,
    'address': {
      'city': cart?.shippingAddress?.city,
      'country': cart?.shippingAddress?.country,
      'line1': cart?.shippingAddress?.streetNumber+' '+cart?.shippingAddress?.streetName,
      'postalCode': cart?.shippingAddress?.postalCode,
      'state': cart?.shippingAddress?.state,
    },
    'gr4vyBuyerId': cart.gr4vyBuyerId?.value,
    'buyerShippingId': cart.shippingAddress?.gr4vyShippingDetailId?.value
  }

  if (updateShippingAddress.buyerShippingId) {
    return gr4vy.updateBuyerShippingDetail(updateShippingAddress)
  } else {
    return gr4vy.addBuyerShippingDetail(updateShippingAddress)
  }
}
