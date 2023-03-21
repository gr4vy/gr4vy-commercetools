const CAPTURE_SUCCEEDED = "capture_succeeded"
const AUTHORIZATION_SUCCEEDED = "authorization_succeeded"
const PROCESSING = 'processing'
const CAPTURE_PENDING = "capture_pending"
const BUYER_APPROVAL_PENDING = 'buyer_approval_pending'
const AUTHORIZATION_DECLINED = "authorization_declined"
const AUTHORIZATION_FAILED = "authorization_failed"
const AUTHORIZATION_VOIDED = 'authorization_voided'
const AUTHORIZATION_VOID_PENDING = 'authorization_void_pending'


export const Constants = {
  CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER: "ctp-gr4vy-configuration",
  //Locales
  defaultLocale: "en",
  STATES: {
    GR4VY: {
      TRANSACTION: {
        PROCESSING_FAILED: 'processing_failed',
        CAPTURE_DECLINED: 'capture_declined',
        CAPTURE_FAILED: 'capture_failed',
        AUTHORIZATION_PENDING: 'authorization_pending',
        AUTHORIZATION_EXPIRED: 'authorization_expired',
        AUTHORIZATION_VOID_DECLINED: 'authorization_void_declined',
        AUTHORIZATION_VOID_FAILED: 'authorization_void_failed',
        REFUND_SUCCEEDED: 'refund_succeeded',
        REFUND_PENDING: 'refund_pending',
        REFUND_DECLINED: 'refund_declined',
        REFUND_FAILED: 'refund_failed',
        BUYER_APPROVAL_SUCCEEDED: 'buyer_approval_succeeded',
        BUYER_APPROVAL_DECLINED: 'buyer_approval_declined',
        BUYER_APPROVAL_FAILED: 'buyer_approval_failed',
        BUYER_APPROVAL_TIMEDOUT: 'buyer_approval_timedout',

        TYPES: {
          AUTHORIZE: "authorize",
          CAPTURE: "capture",
        }
      },
    },
    CT: {
      ORDER: {
        OPEN: "Open",
        CONFIRMED: "Confirmed",
        CANCELLED: "Cancelled",
      },
      ORDERPAYMENT: {
        PAID: "Paid",
        PENDING: "Pending",
        FAILED: "Failed",
      },
      ORDER_RETURN_PAYMENT: {
        REFUNDED: "Refunded",
      },
      TRANSACTION: {
        TYPES: {
          AUTHORIZATION: "Authorization",
          CHARGE: "Charge",
        },
        SUCCESS: "Success",
        PENDING: "Pending",
        FAILURE: "Failure",
      },
      CUSTOM_FIELDS: {
        GR4VY_TRANSACTION_ID: {
          NAME: "gr4vyTransactionId",
          TYPE: "type",
          KEY: "gr4vyTransactionId",
        },
      },
      MESSAGE_TYPES: {
        ORDER: {
          DELIVERY_ADDED: "DeliveryAdded",
          RETURN_INFO_ADDED: "ReturnInfoAdded",
          ORDER_STATE_CHANGED: "OrderStateChanged",
        },
      },
    },
    CT_GRAVY_MAPPING: {
      PROCESS: {
        orderState: "Open",
        orderPaymentState: "Pending",
        transactionState: "Pending"
      },
      SUCCESS: {
        orderState: "Confirmed",
        orderPaymentState: "Paid",
        transactionState: "Success"
      },
      CANCEL: {
        orderState: "Cancelled",
        orderPaymentState: "Failed",
        transactionState: "Failure"
      },
      REFUND_PROCESS: {
        order: "Confirmed",
        payment: "Initial",
        transaction: "Pending"
      },
      REFUND_SUCCESS: {
        order: "Completed",
        payment: "Refunded",
        transaction: "Success"
      },
      REFUND_CANCEL: {
        order: "Confirmed",
        payment: "Not Refunded",
        transaction: "Failure"
      },
    }
  },

  GR4VY_STATUS: {
    SUCCESS_STATUS: [
      CAPTURE_SUCCEEDED,
      AUTHORIZATION_SUCCEEDED
    ],

    PROCESS_STATUS: [
      PROCESSING,
      CAPTURE_PENDING,
      BUYER_APPROVAL_PENDING
    ],

    CANCEL_STATUS: [
      AUTHORIZATION_DECLINED,
      AUTHORIZATION_FAILED,
      AUTHORIZATION_VOID_PENDING,
      AUTHORIZATION_VOIDED
    ]
  }
}
