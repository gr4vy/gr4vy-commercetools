import fetch from "cross-fetch"
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2"
import { createApiBuilderFromCtpClient, ApiRoot } from "@commercetools/platform-sdk"

interface IGraphQLClientProps {
  authHost: string
  apiHost: string
  projectKey: string
  clientId: string
  clientSecret: string
  scopes?: Array<string>
}

export class GraphQLClient {
  apiRoot: ApiRoot

  constructor(props: IGraphQLClientProps) {
    const { authHost, projectKey, clientId, clientSecret, scopes, apiHost } = props
    // Configure authMiddlewareOptions
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: authHost,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: scopes,
      fetch,
    }

    // Configure httpMiddlewareOptions
    const httpMiddlewareOptions: HttpMiddlewareOptions = {
      host: apiHost,
      fetch,
    }
    // ClientBuilder
    const ctpClient = new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withHttpMiddleware(httpMiddlewareOptions)
      .withLoggerMiddleware()
      .build()

    // Create a API root from API builder of commercetools platform client
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient)
  }

  getApiRoot() {
    return this.apiRoot
  }
}
