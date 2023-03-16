// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { Gr4vy } from "@gr4vy-ct/common"
import { phone } from 'phone'

import {UpdateBuyerQuery} from "./../../types"

export const manageBuyerShippingAddress = async ({customer, cart, paymentConfig }: UpdateBuyerQuery) => {
  const { gr4vyId, privateKey } = paymentConfig || {}

  // Initialize gr4vy
  const gr4vy = new Gr4vy({
    gr4vyId,
    privateKey,
    debug: paymentConfig?.debug ? true : false
  })

    //validate phone number. If invalid, format it.
    let phoneNumber = "";
    if(cart?.shippingAddress?.phone) {
      const validatePhone = phone(cart?.shippingAddress?.phone, { country: cart?.shippingAddress?.country})
      phoneNumber = validatePhone.phoneNumber??""
    }

  const updateShippingAddress = {
    'emailAddress': cart?.shippingAddress?.email,
    'firstName': cart?.shippingAddress?.firstName,
    'lastName': cart?.shippingAddress?.lastName,
    ...(phoneNumber? {'phoneNumber': phoneNumber}:{}),
    'address': {
      'city': cart?.shippingAddress?.city,
      'country': cart?.shippingAddress?.country,
      'line1': cart?.shippingAddress?.streetNumber+' '+cart?.shippingAddress?.streetName,
      'line2': cart?.shippingAddress?.additionalStreetInfo,
      'postalCode': cart?.shippingAddress?.postalCode,
      'state': cart?.shippingAddress?.state,
    },
    //if the buyer Id is not there in customer, get it from cart.
    'gr4vyBuyerId': customer?.gr4vyBuyerId?.value?? cart.gr4vyBuyerId?.value,
    'buyerShippingId': cart.shippingAddress?.gr4vyShippingDetailId?.value
  }

  if (updateShippingAddress.buyerShippingId) {
    return gr4vy.updateBuyerShippingDetail(updateShippingAddress)
  } else {
    return gr4vy.addBuyerShippingDetail(updateShippingAddress)
  }
}
