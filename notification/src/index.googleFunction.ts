// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getLogger, Constants } from "@gr4vy-ct/common"

import {
  handleDisabledConfig,
  handleTransactionCapture,
  handleTransactionRefund,
  handleTransactionVoid,
} from "./handler"
import { prepareRequestBody } from "./helper"

// eslint-disable-next-line
export const handler = async (event: any) => {
  const logger = getLogger()
  logger.debug({
    event: JSON.stringify(event),
  })
  const body = prepareRequestBody(event)

  if (!body) {
    const error = new Error("[GCP]:Error during getting notification record")
    logger.error(
      {
        event: JSON.stringify(event),
        notification: undefined,
        error,
      },
      "[GCP]:Unexpected error when processing event"
    )
    throw error
  }

  const isPaymentActive = await handleDisabledConfig(event)
  //if Gr4vy payment is not active, return.
  if (!isPaymentActive) {
    return {
      notificationResponse: "[GCP]:Gr4vy Payment is not active",
      details: JSON.stringify(event),
    }
  }

  const {
    STATES: { CT },
  } = Constants

  try {
    switch (body.type) {
      case CT.MESSAGE_TYPES.ORDER.DELIVERY_ADDED:
        await handleTransactionCapture(event)
        break
      case CT.MESSAGE_TYPES.ORDER.RETURN_INFO_ADDED:
        await handleTransactionRefund(event)
        break
      case CT.MESSAGE_TYPES.ORDER.ORDER_STATE_CHANGED:
        await handleTransactionVoid(event)
        break
      default:
        throw new Error(`Error during identify type of notification. Received type: ${body.type}`)
    }
  } catch (err) {
    logger.error(
      {
        error: JSON.stringify(err),
      },
      "[GCP]:Unexpected exception occurred."
    )
  }

  return {
    notificationResponse: "[Finished successfully]",
  }
}
