// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Gr4vy } from "@gr4vy-ct/common"
import { phone } from 'phone'

import { UpdateBuyerQuery } from "./../../types"

export const updateBuyerDetails = async ({ customer, cart, paymentConfig }: UpdateBuyerQuery) => {
  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: paymentConfig?.debug ? true : false
  })

  //validate phone number. If invalid, format it.
  let phoneNumber = "";
  if(cart?.billingAddress?.phone) {
    const validatePhone = phone(cart?.billingAddress?.phone, { country: cart?.billingAddress?.country})
    phoneNumber = validatePhone.phoneNumber??""
  }

  const updateBuyer = {
    'displayName': customer?.displayName ?? cart?.billingAddress?.firstName + " " + cart?.billingAddress?.lastName,
    'externalIdentifier': cart?.customerId ?? cart?.anonymousId,
    'billingDetails': {
      'emailAddress': cart?.billingAddress?.email,
      'firstName': cart?.billingAddress?.firstName,
      'lastName': cart?.billingAddress?.lastName,
      ...(phoneNumber? {'phoneNumber': phoneNumber}:{}),
      'address': {
        'city': cart?.billingAddress?.city,
        'country': cart?.billingAddress?.country,
        'line1': cart?.billingAddress?.streetNumber??"" + ' ' +cart?.billingAddress?.streetName??"",
        'postalCode': cart?.billingAddress?.postalCode,
        'state': cart?.billingAddress?.state,
      }
    },
    'gr4vyBuyerId': customer?.gr4vyBuyerId?.value?? cart.gr4vyBuyerId?.value  //if the buyer is not there in customer, look in cart.
  }
  return gr4vy.updateBuyer(updateBuyer)
}
