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

  if (customer) {
    customer.displayName = customer?.firstName+' '+customer?.lastName
    customer.externalIdentifier = customer.id?customer.id:cart.anonymousId
  }

  if (cart?.billingAddress?.custom) {
    const {
      custom: { customFieldsRaw },
    } = cart.billingAddress
    cart.billingAddress.gr4vyShippingDetailId =
        customFieldsRaw && Array.isArray(customFieldsRaw)
            ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS)
            : null
  }

  if (cart?.shippingAddress?.custom) {
    const {
      custom: { customFieldsRaw },
    } = cart.shippingAddress
    cart.shippingAddress.gr4vyShippingDetailId =
        customFieldsRaw && Array.isArray(customFieldsRaw)
            ? customFieldsRaw.find((e: { name: string }) => e.name === c.CTP_GR4VY_ADDRESS_DETAIL_ID_ADDRESS)
            : null
  }

  //Add Shipping as an item to the cart Items.
  if (cart?.shippingInfo) {
    const shippingItem: CartItem = {
      name: cart.shippingInfo?.shippingMethodName,
      quantity: 1,
      unitAmount: cart.shippingInfo.discountedPrice?.value.centAmount??cart.shippingInfo.price?.centAmount,
      productType: 'shipping_fee',
      externalIdentifier: cart.shippingInfo?.shippingMethodName,
    };

    cartItems.push(shippingItem);
  }

  return {
    customer,
    cart,
    cartItems,
  }
}

const getCartItem = (c: CartLineItem): CartItem => {
  const {
    id,
    name,
    quantity,
    discountedPricePerQuantity,
    //taxedPrice,
    variant,
    price,
    //productType,
  } = c

  const discountedItemAmount =
    Array.isArray(discountedPricePerQuantity) && discountedPricePerQuantity?.length > 0
      ? discountedPricePerQuantity?.discountedPrice?.value?.centAmount
      : null;

    //calculate total discount amount in all the quantity of items.
    let discountItemAmount = 0;
    if(discountedItemAmount) {
      const totalItemAmount = price?.value?.centAmount * quantity;

      discountItemAmount = totalItemAmount - discountedItemAmount;
    }

  return {
    name,
    quantity,
    unitAmount: price?.value?.centAmount,
    discountAmount: discountItemAmount,
    //taxAmount: taxedPrice?.totalTax?.centAmount || null,
    externalIdentifier: id,
    sku: variant?.sku || null,
    imageUrl: Array.isArray(variant?.images) ? variant?.images[0]?.url : null,
    categories: null,
    productType: 'physical' || null,
  }
}

export { responseMapper }
