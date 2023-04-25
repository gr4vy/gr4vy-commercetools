import { env } from "process"

import { ApiClient, Constants} from "@gr4vy-ct/common"

import {createSubscriptionsMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import C from "./../../../config/constants"

const createSubscriptions = async () => {
  const apiClient = new ApiClient()
  apiClient.setBody({
    query: createSubscriptionsMutationQuery,
    variables: {
      subsKey: C.CT.SUBSCRIPTION.KEY,
      topic: env.CTP_SUBSCRIPTION_GCP_TOPIC,
      projectId: env.CTP_SUBSCRIPTION_GCP_PROJECT_ID

    }
  })
  return responseMapper(await apiClient.getData())
}

export { createSubscriptions as createGcpSubscriptions }
