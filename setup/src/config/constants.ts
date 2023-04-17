export default {
  //Locales
  defaultLocale: "en",
  CT: {
    ORDER: {
      CUSTOM_FIELD: {
        GR4VY_TRANSACTION_ID_KEY: "gr4vyTransactionId",
        GR4VY_TRANSACTION_ID_FIELD_DEF_NAME: "gr4vyTransactionId",
        GR4VY_TRANSACTION_ID_FIELD_DEF_LABEL: "Gr4vy Transaction Id",
        GR4VY_TRANSACTION_ID_NAME_DESC: "Additional field to transaction: Gr4vy Transaction Id",
        GR4VY_REFUND_ID_KEY: "gr4vyRefundId",
        GR4VY_REFUND_ID_FIELD_DEF_NAME: "gr4vyRefundId",
        GR4VY_REFUND_ID_FIELD_DEF_LABEL: "Gr4vy Refund Id",
        GR4VY_REFUND_ID_NAME_DESC: "Additional field to transaction: Gr4vy Refund Id",
        GR4VY_RESPONSE_ID_KEY: "gr4vyTransactionResponse",
        GR4VY_RESPONSE_ID_FIELD_DEF_NAME: "gr4vyTransactionResponse",
        GR4VY_RESPONSE_ID_FIELD_DEF_LABEL: "Gr4vy Transaction Response",
        GR4VY_RESPONSE_ID_NAME_DESC: "Additional field to transaction: Gr4vy Transaction Response"
      }
    },
    CUSTOMER: {
      CUSTOM_FIELD: {}
    },
    SUBSCRIPTION:{
      KEY: "gr4vy-subscription",
      TYPE: {
        AWS: "AWS",
        GCP: "GCP"
      },
      AUTH_MODE: {
        CREDENTIALS: "Credentials",
        IAM: "IAM"
      }
    },
    EXTENSION:{
      KEY: "gr4vy-extension"
    }
  }
}
