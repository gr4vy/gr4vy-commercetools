// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import c from "./constants"

const processingStatuses = {
    processing: c.STATUS_PROCESSING,
    capturePending: c.STATUS_CAPTURE_PENDING,
    succeeded: c.STATUS_AUTHORIZATION_SUCCEEDED,
    approvalPending: c.STATUS_BUYER_APPROVAL_PENDING
}

const cancelStatuses = {
    declined: c.STATUS_AUTHORIZATION_DECLINED,
    failed: c.STATUS_AUTHORIZATION_FAILED,
    voided: c.STATUS_AUTHORIZATION_VOIDED,
    voidPending: c.STATUS_AUTHORIZATION_VOID_PENDING
}

const successStatuses = {
    succeeded: c.STATUS_CAPTURE_SUCCEEDED
}

const refundStatuses = {
    processing: c.REFUND_STATUS_PROCESSING,
    succeeded: c.REFUND_STATUS_SUCCEEDED,
    declined: c.REFUND_STATUS_DECLINED,
    failed: c.REFUND_STATUS_FAILED,
    voided: c.REFUND_STATUS_VOIDED
}

export { processingStatuses, cancelStatuses, successStatuses, refundStatuses }
