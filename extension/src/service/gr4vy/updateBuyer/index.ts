// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Gr4vy } from "@gr4vy-ct/common"

import { UpdateBuyerQuery } from "./../../types"

export const updateBuyerDetails = async ({ customer, cart, paymentConfig }: UpdateBuyerQuery) => {
  const { gr4vyId, privateKey } = paymentConfig.value || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
  })

  const updateBuyer = {
    'displayName': customer?.displayName,
    'externalIdentifier': customer?.externalIdentifier,
    'billingDetails': {
      'emailAddress': cart?.billingAddress?.email,
      'firstName': cart?.billingAddress?.firstName,
      'lastName': cart?.billingAddress?.lastName,
      'phoneNumber': cart?.billingAddress?.phone,
      'address': {
        'city': cart?.billingAddress?.city,
        'country': cart?.billingAddress?.country,
        'line1': cart?.billingAddress?.streetNumber+' '+cart?.billingAddress?.streetName,
        'postalCode': cart?.billingAddress?.postalCode,
        'state': cart?.billingAddress?.state,
      }
    },
    'gr4vyBuyerId': cart.gr4vyBuyerId?.value
  }

  return gr4vy.updateBuyer(updateBuyer)
}
