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

export declare type TransactionCaptureParams = {
  amount: number
  transactionId: string
}
