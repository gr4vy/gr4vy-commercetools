export const LOCALE = 'LOCALE';
export const LOCATION = 'LOCATION';
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
export const ALL = 'all';
export const DEFAULT_PAGE_SIZE = Number(
  process.env.VUE_APP_PAGE_SIZE || 10
);
export const CUSTOMER = 'CUSTOMER';
export const CHANNEL = 'CHANNEL';

//Commercetools constants
export const CHARGE = 'Charge';
export const AUTHORIZATION = 'Authorization';

//gr4vy constants
export const GR4vy_PAYMENT_METHOD = "gr4vy"

export const GR4VY_STATE_WIDGET_LOADING = "gr4vy_state_widget_loading";
export const GR4VY_STATE_WIDGET_ERROR = "gr4vy_state_widget_error";
export const GR4VY_STATE_PAYMENT_COMPONENT_READY_FLAG = "gr4vy_state_payment_component_ready_flag";
export const GR4VY_STATE_SHIPPING_SAVED_FLAG = "gr4vy_state_shipping_saved_flag";
export const GR4VY_STATE_LOAD_GR4VY_WIDGET_FLAG = "gr4vy_state_load_gr4vy_widget_flag";

export const GR4VY_FIELD_PAYMENT_TITLE = "gr4vy_field_payment_title";