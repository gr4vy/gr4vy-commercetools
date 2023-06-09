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

  const cartTaxCalculationMode = cart?.taxCalculationMode
  if (cartTaxCalculationMode == 'LineItemLevel') {
    throw new Error(
        "TaxCalculationMode should be set to 'UnitPriceLevel'"
    )
  }

  const cartItems: CartItem[] =
    cart?.lineItems && Array.isArray(cart?.lineItems)
      ? cart?.lineItems.map((c: CartLineItem) => getCartItem(c))
      : []

  if (customer) {
    customer.displayName = customer?.firstName+' '+customer?.lastName
    customer.externalIdentifier = customer.id?customer.id:cart.anonymousId
  }

  //Add Shipping as an item to the cart Items.
  if (cart?.shippingInfo) {
    let shippingTotal = 0;
    const shippingPrice =
        cart.shippingInfo.discountedPrice?.value.centAmount ?? (cart.shippingInfo.price?.centAmount ?? 0)
    const shippingTaxIncludedInPrice = cart.shippingInfo.taxRate?.includedInPrice
    const shippingTotalTax = cart?.taxedShippingPrice?.totalTax?.centAmount ?? 0
    const shippingTotalNet = cart.shippingInfo.taxedPrice?.totalNet.centAmount ?? 0
    if (shippingTaxIncludedInPrice) {
      shippingTotal = shippingTotalNet + shippingTotalTax;
    } else {
      shippingTotal = shippingPrice + shippingTotalTax
    }
    if (shippingTotal > 0) {
      const shippingItem: CartItem = {
        name: cart.shippingInfo?.shippingMethodName,
        quantity: 1,
        unitAmount: shippingTaxIncludedInPrice ? shippingTotalNet : shippingPrice,
        productType: "shipping_fee",
        taxAmount: shippingTotalTax,
        externalIdentifier: cart.shippingInfo?.shippingMethodName,
      }
      cartItems.push(shippingItem)
    }
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
    taxedPrice,
    taxRate,
    variant,
    price,
    productId,
    //productType,
  } = c

  let discountItemAmount = 0;
    let productDiscountAmount = 0;

    const productPrice = price?.value?.centAmount;
    const productDiscountPrice = price?.discounted?.value?.centAmount;
    const taxedPriceAmount = taxedPrice?.totalTax?.centAmount
    const isTaxIncludedInPrice = taxRate?.includedInPrice
    const taxedUnitPrice = taxedPriceAmount/quantity
    const productPriceExclTax = Math.round(productPrice - taxedUnitPrice)

    //calculate product level discount
    if (productDiscountPrice != null) {
        productDiscountAmount = (productPrice - productDiscountPrice) * quantity;
    }

    let cartDiscountedItemAmount = 0;
    let cartDiscountActive = false;

    if(discountedPricePerQuantity?.length > 0){
      cartDiscountActive = true;
      discountedPricePerQuantity.forEach(
          function (item) {
            cartDiscountedItemAmount += item.discountedPrice?.value?.centAmount * item.quantity;
          }
      )
    }
    //calculate total discount amount in all the quantity of items.
    if (cartDiscountActive) {
        const totalItemAmount = productPrice * quantity;
        discountItemAmount = totalItemAmount - (cartDiscountedItemAmount);
    }
    //Calculate product level discount only if cart level discount is not present.
    //If both cart level and product level discounts are active, discountedPricePerQuantity will
    //contain the total of cart level and product level discount values
    if (!cartDiscountActive && productDiscountAmount) {
        discountItemAmount = discountItemAmount + productDiscountAmount
    }

  return {
    name,
    quantity,
    unitAmount: isTaxIncludedInPrice ? productPriceExclTax : productPrice,
    discountAmount: discountItemAmount,
    taxAmount: taxedPriceAmount || null,
    externalIdentifier: id,
    sku: variant?.sku || null,
    imageUrl: Array.isArray(variant?.images) ? variant?.images[0]?.url : null,
    categories: null,
    productType: 'physical' || null,
    productId,
  }
}

export { responseMapper }
