import c from "./../../../config/constants"
import { Customer, CartLineItem, CartItem, Cart, CustomerCartResult } from "./../../types"

const responseMapper = async (
  result: CustomerCartResult
): Promise<{
  customer: Customer | null
  cart: Cart
  cartItems: CartItem[]
}> => {
  const { customer, activeCart: cart } = result?.body?.data?.me || {}

  if (customer?.custom) {
    const {
      custom: { customFieldsRaw },
    } = customer
    customer.gr4vyBuyerId =
      customFieldsRaw && Array.isArray(customFieldsRaw)
        ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_BUYER_ID_FIELD.NAME)
        : null
  }

  const cartItems: CartItem[] =
    cart?.lineItems && Array.isArray(cart?.lineItems)
      ? cart?.lineItems.map((c: CartLineItem) => getCartItem(c))
      : []

  return {
    customer,
    cart,
    cartItems,
  }
}

const getCartItem = (c: CartLineItem): CartItem => {
  const {
    id,
    productId,
    name,
    quantity,
    discountedPricePerQuantity,
    taxedPrice,
    variant,
    price,
    productType,
  } = c

  const discountAmount =
    Array.isArray(discountedPricePerQuantity) && discountedPricePerQuantity?.length > 0
      ? discountedPricePerQuantity?.discountedPrice?.value?.centAmount
      : null

  return {
    name,
    productId,
    quantity,
    unitAmount: price?.value?.centAmount,
    discountAmount,
    taxAmount: taxedPrice?.totalTax?.centAmount || null,
    externalIdentifier: id || null,
    sku: variant?.sku || null,
    imageUrl: Array.isArray(variant?.images) ? variant?.images[0]?.url : null,
    categories: null,
    productType: productType?.name || null,
  }
}

export { responseMapper }
