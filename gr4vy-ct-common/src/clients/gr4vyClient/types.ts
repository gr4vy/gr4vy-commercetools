export declare type Options = {
  gr4vyId: string
  privateKey: string
  baseUrl?: string
  debug?: boolean
  environment?: "production" | "sandbox"
}

export declare type EmbedParams = {
  amount: number
  currency: string
  buyerId?: string
  buyerExternalIdentifier?: string
  metadata?: Record<string, string>
  cartItems?: []
}

export declare type BuyerParams = {
  externalIdentifier?: string | null
  displayName?: string | null
}

export declare type UpdateBuyerParams = {
  displayName?: string | null
  externalIdentifier?: string | null,
  billingDetails: {
    emailAddress?: string | null
    firstName?: string | null
    lastName?: string | null
    phoneNumber?: string | null
    address: {
      city?: string | null
      country?: string | null
      line1?: string | null
      postalCode?: string | null
      state?: string | null
    }
  }
  gr4vyBuyerId: string
}

export declare type UpdateBuyerShippingAddressParams = {
  emailAddress?: string | null
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  address: {
    city?: string | null
    country?: string | null
    line1?: string | null
    postalCode?: string | null
    state?: string | null
  }
  gr4vyBuyerId: string
  buyerShippingId: string
}

export declare type TransactionCaptureParams = {
  amount: number
  transactionId: string
}

export declare type TransactionRefundParams = {
  amount: number,
  transactionId: string
}

export declare type TransactionVoidParams = {
  transactionId: string
}
