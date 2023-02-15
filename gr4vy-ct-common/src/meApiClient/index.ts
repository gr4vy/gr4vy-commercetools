import { env } from "process"

import { GraphQLClient } from "../graphqlClient"

export class MeApiClient {
  gClient: GraphQLClient
  projectKey: string
  query: string
  variables = {} as { [key: string]: string }
  headers = {} as { [key: string]: string }

  constructor(props: { bearerToken: string }) {
    this.gClient = new GraphQLClient()

    this.gClient.setClientwithExistingTokenFlow({
      apiHost: env.CTP_API_URL as string,
      bearerToken: props.bearerToken,
    })

    this.projectKey = env.CTP_PROJECT_KEY as string
  }

  setBody({ query, variables }: { query: string; variables: { [key: string]: string } }) {
    this.query = query
    this.variables = variables
  }

  async getData() {
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
        })
        .execute()
    } catch (error) {
      return error
    }
  }
}
