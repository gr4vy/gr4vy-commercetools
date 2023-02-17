import c from "./../../../config/constants"

const responseMapper = async (result: any) => {
  const { customer, activeCart: cart } = result?.body?.data?.me || {}

  if (customer && customer?.custom) {
    const {
      custom: { customFieldsRaw },
    } = customer
    customer.gr4vyBuyerId =
      customFieldsRaw && Array.isArray(customFieldsRaw)
        ? customFieldsRaw.find((e: any) => e.name === c.CTP_GR4VY_BUYER_FIELD_ID)
        : null

    // delete the custom prop from response
    delete customer.custom
  }

  return {
    customer,
    cart,
  }
}

export { responseMapper }
