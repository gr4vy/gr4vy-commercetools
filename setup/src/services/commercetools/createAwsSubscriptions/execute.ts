// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { env } from "process"

import { ApiClient } from "@gr4vy-ct/common"

import {createSubscriptionsMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import C from "./../../../config/constants"

const createSubscriptions = async () => {
  const apiClient = new ApiClient()
  apiClient.setBody({
    query: createSubscriptionsMutationQuery,
    variables: {
      subsKey: C.CT.SUBSCRIPTION.KEY,
      queueUrl: env.CTP_SUBSCRIPTION_AWS_SQS_QUEUE_URL,
      region: env.CTP_SUBSCRIPTION_AWS_SQS_REGION,
      accessKey: env.CTP_SUBSCRIPTION_SQS_ACCESS_KEY || null,
      accessSecret: env.CTP_SUBSCRIPTION_SQS_ACCESS_SECRET || null,
      authMode: env.CTP_SUBSCRIPTION_AWS_SQS_AUTH_MODE,
    }
  })
  return responseMapper(await apiClient.getData())
}

export { createSubscriptions as createAwsSubscriptions }
