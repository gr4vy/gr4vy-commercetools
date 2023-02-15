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
