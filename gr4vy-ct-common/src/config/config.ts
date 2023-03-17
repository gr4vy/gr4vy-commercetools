const successStatuses = [
    "capture_succeeded",
    "authorization_succeeded",
]

const processStatuses = [
    'processing',
    "capture_pending",
    'buyer_approval_pending',
]

const cancelStatuses = [
    "authorization_declined",
    "authorization_failed",
    'authorization_voided',
    'authorization_void_pending',
]

export { successStatuses, cancelStatuses, processStatuses }
