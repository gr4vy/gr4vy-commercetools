import { IncomingMessage } from "http"

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MeApiClient } from "@gr4vy-ct/common"

import { getCustomerWithCartQuery, getProductsCategoriesQuery } from "./query"
import { responseMapper } from "./mapper"
import { Customer, Cart, CartItem, ProductMasterDataCurrent } from "./../../types"
import c from "./../../../config/constants"

const getCustomerWithCart = async (request: IncomingMessage, locale: string) => {
  const meApiClient: MeApiClient = new MeApiClient({
    request,
  })

  // Get customer and cart from commercetools
  meApiClient.setBody({
    query: getCustomerWithCartQuery,
    variables: {
      locale: locale || c.defaultLocale,
    },
  })

  const result = await responseMapper(await meApiClient.getData())

  // Set product categories to the result
  await setProductCategoryInResult(meApiClient, result)

  return result
}

const setProductCategoryInResult = async (
  meApiClient: MeApiClient,
  result: {
    customer: Customer | null
    cart: Cart
    cartItems: CartItem[]
  }
) => {
  // Prepare skus for the API call
  const skus =
    result?.cartItems?.filter(cartItem => cartItem?.sku).map(cartItem => cartItem?.sku) || []

  if (!skus.length) {
    return result
  }

  const locale = result?.cart?.locale ?? c.defaultLocale

  meApiClient.setBody({
    query: getProductsCategoriesQuery,
    variables: {
      skus,
      locale,
    },
  })

  // Fetch the result
  const productCategories = await meApiClient.getData()
  const { results: products } = productCategories?.body?.data?.products || []

  if (!products.length) {
    return result
  }

  const productCategoryMapper: { [key: string]: string[] } = {}
  products.forEach((product: ProductMasterDataCurrent) => {
    const categories = product?.masterData?.current?.categories || []
    if (categories.length) {
      productCategoryMapper[product.id] = categories.map(c => c.name)
    }
  })

  result.cartItems.forEach((cartItem: CartItem) => {
    const productId = cartItem.productId || ""
    cartItem.categories = productCategoryMapper[productId] ?? []
  })
}

export { getCustomerWithCart }
