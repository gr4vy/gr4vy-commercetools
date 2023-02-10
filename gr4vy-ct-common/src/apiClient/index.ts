import { GraphQLClient, Options } from "../graphqlClient"

export class ApiClient {
  gClient: GraphQLClient
  projectKey: string
  query: string
  variables = {} as { [key: string]: string }
  headers = {} as { [key: string]: string }

  constructor({
    authHost,
    apiHost,
    projectKey,
    clientId,
    clientSecret,
    scopes,
  }: Options) {
    this.gClient = new GraphQLClient({
      authHost,
      apiHost,
      projectKey,
      clientId,
      clientSecret,
      scopes,
    })
    this.projectKey = projectKey
  }

  setBody({ query, variables }: { query: string; variables: { [key: string]: string } }) {
    this.query = query
    this.variables = variables
  }

  setAuthorizationBearerHeader(authToken: string) {
    this.headers["Authorization"] = authToken
  }

  async execute() {
    try {
      return this.gClient
        .getApiRoot()
        .withProjectKey({ projectKey: this.projectKey })
        .graphql()
        .post({
          body: {
            query: this.query,
            variables: this.variables,
          },
          headers: this.headers,
        })
        .execute()
        .then((data: any) => data)
        .catch((error: any) => error)
    } catch (error) {
      return error
    }
  }
}
