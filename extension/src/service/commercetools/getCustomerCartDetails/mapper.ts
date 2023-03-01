import {UpdateBuyer, Gr4vyBuyerId, UpdateShippingAddress, UpdateGr4vyReference} from "./../../types"
import c from "../../../config/constants";

const responseMapper = async (
    result: any
): Promise<{
  updateBuyer: UpdateBuyer,
  gr4vyBuyerId: Gr4vyBuyerId
  updateShippingAddress: UpdateShippingAddress
  updateGr4vyReference: UpdateGr4vyReference
}> => {
  const {customer, activeCart } = result?.body?.data?.me || {}

  const external_identifier = customer.id?customer.id:activeCart.anonymousId
  const street = activeCart?.billingAddress?.streetNumber+' '+activeCart?.billingAddress?.streetName;
  const customerId = customer.id?customer.id:activeCart.anonymousId

  const updateBuyer = {
    'display_name': customer?.firstName+' '+customer?.lastName,
    'external_identifier': external_identifier,
    'billing_details': {
      'email_address': activeCart?.billingAddress?.email,
      'first_name': activeCart?.customer?.firstName,
      'last_name': activeCart?.customer?.lastName,
      'phone_number': activeCart?.billingAddress?.phone,
      'address': {
        'city': activeCart?.billingAddress?.city,
        'country': activeCart?.billingAddress?.country,
        'line1': street,
        'postal_code': activeCart?.billingAddress?.postalCode,
        'state': activeCart?.billingAddress?.state,
      }
    }
  }

  let customerGr4vyId = {
    "name": "",
    "value": ""
  };

  if (customer && customer?.custom) {
    const {
      custom: { customFieldsRaw },
    } = customer
    customerGr4vyId =
        customFieldsRaw && Array.isArray(customFieldsRaw)
            ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_BUYER_ID_FIELD.NAME)
            : null
  }

  const gr4vyBuyerId = {
    'gr4vyBuyerId': customerGr4vyId?.value
  }

  let gr4vyShippingDetailId = {
    "name": "",
    "value": ""
  }

  if (activeCart && activeCart?.shippingAddress.custom) {
    const {
      custom: { customFieldsRaw },
    } = customer
    gr4vyShippingDetailId =
        customFieldsRaw && Array.isArray(customFieldsRaw)
            ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS)
            : null
  }

  const shippingStreet = activeCart?.shippingAddress?.streetNumber+' '+activeCart?.shippingAddress?.streetName;
  const updateShippingAddress = {
    'email_address': activeCart?.shippingAddress?.email,
    'first_name': activeCart?.shippingAddress?.firstName,
    'last_name': activeCart?.shippingAddress?.lastName,
    'phone_number': activeCart?.shippingAddress?.phone,
    'address': {
      'city': activeCart?.shippingAddress?.city,
      'country': activeCart?.shippingAddress?.country,
      'line1': shippingStreet,
      'postal_code': activeCart?.shippingAddress?.postalCode,
      'state': activeCart?.shippingAddress?.state,
    },
    'buyerId': gr4vyBuyerId.gr4vyBuyerId,
    'buyerShippingId': gr4vyShippingDetailId?.value
  }

  const updateGr4vyReference = {
    'customerVersion': customer?.version,
    'customerId': customerId,
    'gr4vyBuyerId': gr4vyBuyerId.gr4vyBuyerId,
    'orderVersion': activeCart.version,
    'addressId': activeCart?.shippingAddress?.id,
    'ctCustomFieldNameAddressId': c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS,
    'addressDetailId': updateShippingAddress?.buyerShippingId,
    'orderId': activeCart?.id,
    'ctCustomFieldNameBuyerIdOrder': c.CTP_GR4VY_BUYER_ID_FIELD.NAME
  }

  return {
    updateBuyer,
    gr4vyBuyerId,
    updateShippingAddress,
    updateGr4vyReference
  }
}

export { responseMapper }
