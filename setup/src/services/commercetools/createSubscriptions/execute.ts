// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ApiClient, Constants} from "@gr4vy-ct/common"
import {createSubscriptionsMutationQuery} from "./query"
import {responseMapper} from "./mapper"
import { env } from "process"
import C from "./../../../config/constants"

const createSubscriptions = async () => {
  const apiClient: ApiClient = new ApiClient()
  apiClient.setBody({
    query: createSubscriptionsMutationQuery,
    variables: {
      subsKey: C.CT.SUBSCRIPTION.KEY,
      queueUrl: env.CTP_SUBSCRIPTION_SQS_QUEUE_URL,
      accessKey: env.CTP_SUBSCRIPTION_SQS_ACCESS_KEY,
      accessSecret: env.CTP_SUBSCRIPTION_SQS_ACCESS_SECRET,
      region: env.CTP_SUBSCRIPTION_SQS_REGION

    }
  })
  return responseMapper(await apiClient.getData())
}

export { createSubscriptions }
