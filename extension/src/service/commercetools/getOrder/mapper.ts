import {UpdateBuyer, Gr4vyBuyerId, UpdateShippingAddress} from "./../../types"
import c from "../../../config/constants";

const responseMapper = async (
    result: any
): Promise<{
  updateBuyer: UpdateBuyer,
  gr4vyBuyerId: Gr4vyBuyerId
  updateShippingAddress: UpdateShippingAddress
}> => {
  const stripeOrder = result?.body?.data?.order || {}

  const firstName = stripeOrder?.customer?.firstName;
  const lastName = stripeOrder?.customer?.lastName;
  const display_name = firstName+' '+lastName;
  const external_identifier = stripeOrder.customerId?stripeOrder.customerId:stripeOrder.anonymousId

  const street = stripeOrder?.billingAddress?.streetNumber+' '+stripeOrder?.billingAddress?.streetName;

  const updateBuyer = {
    'display_name': display_name,
    'external_identifier': external_identifier,
    'billing_details': {
      'email_address': stripeOrder?.billingAddress?.email,
      'first_name': stripeOrder?.customer?.firstName,
      'last_name': stripeOrder?.customer?.lastName,
      'phone_number': stripeOrder?.billingAddress?.phone,
      'address': {
        'city': stripeOrder?.billingAddress?.city,
        'country': stripeOrder?.billingAddress?.country,
        'line1': street,
        'postal_code': stripeOrder?.billingAddress?.postalCode,
        'state': stripeOrder?.billingAddress?.state,
      }
    }
  }

  let customerGr4vyId = {
      "name": "",
      "value": {
        "en": ""
      }
    };

  if (stripeOrder && stripeOrder?.customer?.custom) {
    const {
      custom: { customFieldsRaw },
    } = stripeOrder?.customer
    customerGr4vyId =
        customFieldsRaw && Array.isArray(customFieldsRaw)
            ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_BUYER_FIELD_ID_CUSTOMER)
            : null
  }

  const gr4vyBuyerId = {
    'gr4vyBuyerId': customerGr4vyId?.value?.en
  }

  const shippingStreet = stripeOrder?.shippingAddress?.streetNumber+' '+stripeOrder?.shippingAddress?.streetName;
  const updateShippingAddress = {
    'email_address': stripeOrder?.shippingAddress?.email,
    'first_name': stripeOrder?.shippingAddress?.firstName,
    'last_name': stripeOrder?.shippingAddress?.lastName,
    'phone_number': stripeOrder?.shippingAddress?.phone,
    'address': {
      'city': stripeOrder?.shippingAddress?.city,
      'country': stripeOrder?.shippingAddress?.country,
      'line1': shippingStreet,
      'postal_code': stripeOrder?.shippingAddress?.postalCode,
      'state': stripeOrder?.shippingAddress?.state,
    },
    'buyerId': gr4vyBuyerId.gr4vyBuyerId,
    'buyerShippingId': '1caa0984-100f-4554-990e-f79440ca322c' //To Do
  }

  return {
    updateBuyer,
    gr4vyBuyerId,
    updateShippingAddress
  }
}

export { responseMapper }
