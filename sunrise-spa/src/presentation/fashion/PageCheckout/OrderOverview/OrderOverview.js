// @todo: add scrollbar
// import VuePerfectScrollbar from "vue-perfect-scrollbar";
import PaymentMethod from './PaymentMethod/PaymentMethod.vue';
import BasePrice from 'presentation/components/BasePrice/BasePrice.vue';
import { useI18n } from 'vue-i18n';
import ShippingMethod from './ShippingMethod/ShippingMethod.vue';
import useCartTools from 'hooks/useCartTools';

export default {
  props: {
    showError: {
      type: Boolean,
      required: false,
    },
    cart: {
      type: Object,
      required: false,
    },
    placeOrder: {
      type: Function,
      required: true
    },

  },
  components: {
    ShippingMethod,
    BasePrice,
    PaymentMethod,
    // VuePerfectScrollbar,
  },
  setup(props, { emit }) {
    const { t } = useI18n();

    const updateShippingMethod = (shippingId) => {
      emit('update-shipping', shippingId);
    };

    return {
      ...useCartTools(),
      t,
      updateShippingMethod,
    };
  },
};
