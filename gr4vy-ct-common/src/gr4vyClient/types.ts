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
}

export declare type BuyerParams = {
  externalIdentifier?: string | null
  displayName?: string | null
}

export declare type UpdateBuyerParams = {
  external_identifier: string
  display_name: string
  billing_details: {
    email_address: string
    first_name: string
    last_name: string
    phone_number: string
    address: {
      city: string
      country: string
      line1: string
      postal_code: string
      state: string
    }
  }
}

export declare type ParamGr4vyBuyerId = {
  gr4vyBuyerId: string
}

export declare type UpdateBuyerShippingAddressParams = {
  email_address: string
  first_name: string
  last_name: string
  phone_number: string
  address: {
    city: string
    country: string
    line1: string
    postal_code: string
    state: string
  }
  buyerId: string
  buyerShippingId: string
}

export declare type TransactionCaptureParams = {
  amount: number,
  transactionId: string
}
