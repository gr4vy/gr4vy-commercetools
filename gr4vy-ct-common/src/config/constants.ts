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
  },
}
