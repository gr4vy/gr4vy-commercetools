import { env } from "process";

import C from './config/constants'

const validate = () => {
    if (!env.CTP_SUBSCRIPTION_TYPE) {
        throw new Error("Missing Subscription Type. It should be either AWS or GCP");
    }
    if (env.CTP_SUBSCRIPTION_TYPE == C.CT.SUBSCRIPTION.TYPE.AWS) {
        if (!env.CTP_SUBSCRIPTION_AWS_SQS_AUTH_MODE) {
            throw new Error("Missing AWS Authentication Mode.")
        }
        if (C.CT.SUBSCRIPTION.AUTH_MODE.CREDENTIALS != env.CTP_SUBSCRIPTION_AWS_SQS_AUTH_MODE && C.CT.SUBSCRIPTION.AUTH_MODE.IAM != env.CTP_SUBSCRIPTION_AWS_SQS_AUTH_MODE) {
            throw new Error("AuthenticationMode should be either Credentials or IAM")
        }
        if (env.CTP_SUBSCRIPTION_AWS_SQS_AUTH_MODE == C.CT.SUBSCRIPTION.AUTH_MODE.CREDENTIALS) {
            if (!env.CTP_SUBSCRIPTION_AWS_SQS_ACCESS_KEY) {
                throw new Error("Missing AWS Access Key")
            }
            if (!env.CTP_SUBSCRIPTION_AWS_SQS_ACCESS_SECRET) {
                throw new Error("Missing AWS Access Secret")
            }
        }
        if (!env.CTP_SUBSCRIPTION_AWS_SQS_QUEUE_URL) {
            throw new Error("Missing AWS SQS Queue URL");
        }
        if (!env.CTP_SUBSCRIPTION_AWS_SQS_REGION) {
            throw new Error("Missing AWS SQS Region")
        }
    }
    else if (env.CTP_SUBSCRIPTION_TYPE == C.CT.SUBSCRIPTION.TYPE.GCP) {
        if (!env.CTP_SUBSCRIPTION_GCP_TOPIC) {
            throw new Error("Missing GCP Topic");
        }
        if (!env.CTP_SUBSCRIPTION_GCP_PROJECT_ID) {
            throw new Error("Missing GCP Project Id");
        }
        if (!env.CTP_EXTENSION_AUTH_HEADER) {
            throw new Error("Missing GCP Authorization Header");
        }
    }

    if(!env.CTP_EXTENSION_URL) {
        throw new Error("Missing Extension URL");
    }
}

export { validate }