export const Constants = {
  CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER: "ctp-gr4vy-configuration",
  //Locales
  defaultLocale: "en",
  STATES: {
    GR4VY: {
      TRANSACTION: {
        STATUS_GROUPS:{
          PROCESS: {
            PROCESSING: 'processing',
            CAPTURE_PENDING: "capture_pending",
            BUYER_APPROVAL_PENDING: 'buyer_approval_pending',
          },

          SUCCESS: {
            CAPTURE_SUCCEEDED: "capture_succeeded",
            AUTHORIZATION_SUCCEEDED: "authorization_succeeded",
          },

          CANCEL: {
            AUTHORIZATION_DECLINED: "authorization_declined",
            AUTHORIZATION_FAILED: "authorization_failed",
            AUTHORIZATION_VOIDED: 'authorization_voided',
            AUTHORIZATION_VOID_PENDING: 'authorization_void_pending',
          },

          REFUND: {
            PROCESS: {
              PROCESSING: 'processing',
            },
            SUCCESS: {
              SUCCEEDED: 'succeeded',
            },
            CANCEL: {
              DECLINED: 'declined',
              FAILED: 'failed',
              VOIDED: 'voided',
            },
          },
        },

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

        GROUP: {
          AUTHORIZATION_GROUP: {
            AUTHORIZATION_SUCCEEDED: "authorization_succeeded",
            AUTHORIZATION_DECLINED: "authorization_declined",
            AUTHORIZATION_FAILED: "authorization_failed",
            AUTHORIZATION_VOIDED: 'authorization_voided',
            AUTHORIZATION_VOID_PENDING: 'authorization_void_pending',
          },
          CAPTURE_GROUP: {
            CAPTURE_SUCCEEDED: "capture_succeeded",
            CAPTURE_PENDING: "capture_pending",
          },
          REFUND_GROUP: {

          }
        },
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
      TRANSACTION: {
        TYPES: {
          AUTHORIZATION: "Authorization",
          CHARGE: "Charge",
        },
        SUCCESS: "Success",
        PENDING: "Pending",
        FAILURE: "Failure",
      },
    },
    CT_GRAVY_MAPPING: {
      PROCESS: {
        order: "Open",
        payment: "Pending",
        transaction: "Pending"
      },
      SUCCESS: {
        order: "Confirmed",
        payment: "Paid",
        transaction: "Success"
      },
      CANCEL: {
        order: "Cancelled",
        payment: "Failed",
        transaction: "Failure"
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
}
