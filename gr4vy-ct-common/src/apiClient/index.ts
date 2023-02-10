import { GraphQLClient } from "../graphqlClient"

export class ApiClient {
  gClient: any
  query: any
  variables: any

  constructor() {
    //TODO: will move credentials to env
    this.gClient = new GraphQLClient({
      authHost: "https://auth.europe-west1.gcp.commercetools.com",
      apiHost: "https://api.europe-west1.gcp.commercetools.com",
      projectKey: "gr4vy",
      clientId: "NNceCWuZHd8665wfEmH8Jel0",
      clientSecret: "UUv_im19Eox7nUHGdn3gYCjT_9sIqY64",
      scopes: ["manage_project:gr4vy"],
    })
  }

  setBody({ query, variables }: { query: any; variables?: any }) {
    this.query = query
    this.variables = variables
  }

  async get() {
    try {
      return this.gClient
        .getApiRoot()
        .withProjectKey({ projectKey: "gr4vy" })
        .graphql()
        .post({
          body: {
            query: this.query,
            variables: this.variables,
          },
          headers: {
            Authorization: "Bearer RlGb7MIHMLQcdzcVctDEt0fnTgAm3V9N", // TODO: get token from header
          },
        })
        .execute()
        .then((data: any) => data)
        .catch((error: any) => error)
    } catch (error) {
      return error
    }
  }
}
