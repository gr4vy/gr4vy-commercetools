import { onMounted, inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Loading from 'vue-loading-overlay';

import {
  GR4VY_STATE_WIDGET_LOADING,
  GR4VY_STATE_WIDGET_ERROR,
  GR4VY_STATE_PAYMENT_COMPONENT_READY_FLAG,
  GR4VY_FIELD_PAYMENT_TITLE,
} from '../../../../../constants'

export default {
  components: {
    Loading
  },
  setup() {
    const { t } = useI18n();

    const widgetLoading = inject(GR4VY_STATE_WIDGET_LOADING)
    const gr4vyWidgetError = inject(GR4VY_STATE_WIDGET_ERROR)
    const isPaymentComponentReady = inject(GR4VY_STATE_PAYMENT_COMPONENT_READY_FLAG)
    const paymentTitle = inject(GR4VY_FIELD_PAYMENT_TITLE)

    onMounted(async () =>{
      isPaymentComponentReady.value = true;
    })

    return {
      t,
      gr4vyWidgetError,
      widgetLoading,
      paymentTitle,
    };
  },
};
