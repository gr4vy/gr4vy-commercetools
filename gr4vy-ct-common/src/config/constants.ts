export const Constants = {
  CTP_GR4VY_PAYMENT_CONFIGURATION_CONTAINER: "ctp-gr4vy-configuration",
  //Locales
  defaultLocale: "en",
  STATES: {
    GR4VY: {
      TRANSACTION: {
        AUTHORIZATION_SUCCEEDED: "authorization_succeeded",
        CAPTURE_PENDING: "capture_pending",
        CAPTURE_SUCCEEDED: "capture_succeeded",
        AUTHORIZATION_DECLINED: "authorization_declined",
        AUTHORIZATION_FAILED: "authorization_failed",
        AUTHORIZATION_VOIDED: "authorization_voided",
        REFUND_SUCCEEDED: "succeeded",
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
  },
}
