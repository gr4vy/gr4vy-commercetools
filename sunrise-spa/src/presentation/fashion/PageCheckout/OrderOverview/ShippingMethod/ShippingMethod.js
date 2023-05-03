//do not need vuelidate, default method is set in setup when needed

import BaseMoney from 'presentation/components/BaseMoney/BaseMoney.vue';
import { onMounted, inject, ref, shallowRef, watch } from 'vue';
import useShippingMethods from 'hooks/useShippingMethods';
import useCartTools from 'hooks/useCartTools';

import {
  GR4VY_STATE_SHIPPING_SAVED_FLAG,
  GR4VY_STATE_LOAD_GR4VY_WIDGET_FLAG,
} from '../../../../../constants'

export default {
  props: {
    cart: {
      type: Object,
      required: true,
    },

  },
  components: {
    BaseMoney,
  },
  setup( props ) {
    const { total, loading, error, shippingMethods } =
      useShippingMethods(props.cart.cartId);
    const selectedShippingMethod = ref(
      props.cart?.shippingInfo?.shippingMethod?.methodId
    );
    const cartTools = useCartTools();
    const isShippingReady = inject(GR4VY_STATE_SHIPPING_SAVED_FLAG)
    const loadGr4vyWidget = inject(GR4VY_STATE_LOAD_GR4VY_WIDGET_FLAG);

    watch(selectedShippingMethod, async(methodId) => {
      if (!methodId) {
        return;
      }
      //Allow Gr4vy widget to load only after shipping is updated.
      isShippingReady.value = false;
      await cartTools.setShippingMethod(methodId);
      isShippingReady.value = true;
      loadGr4vyWidget.value = true; //if shipping changes, refresh widget.

    });
    watch(shippingMethods, (shippingMethods) => {
      if (
        !props.cart?.shippingInfo?.shippingMethod
          ?.methodId &&
        Boolean(shippingMethods?.length)
      ) {
        selectedShippingMethod.value = (
          shippingMethods.find(
            ({ isDefault }) => isDefault
          ) || shippingMethods[0]
        ).methodId;
      }
    });
    const setSelectedShippingMethod = (method) => {
      selectedShippingMethod.value = method;
    };
    const price = (shippingMethod) => {
      //zone rates not for this country will be filtered out by graphql
      //  shipping rates, not sure
      const rate = shippingMethod?.zoneRates
        ?.flatMap(({ shippingRates }) => shippingRates)
        .find(({ isMatching }) => isMatching);
      return props.cart.totalPrice.centAmount >
        (rate?.freeAbove?.centAmount || Infinity)
        ? null
        : rate?.price;
    };

    const method = shallowRef(selectedShippingMethod);
    watch(method, (method) => {
      setSelectedShippingMethod(method);
    });

    onMounted(() => {
      //on initial load if there a selected shipping, payment can be loaded.
      if (
        props.cart?.shippingInfo?.shippingMethod
          ?.methodId) {
        isShippingReady.value = true;
      }
    })

    return {
      method,
      total,
      loading,
      error,
      shippingMethods,
      price,
      selectedShippingMethod,
      setSelectedShippingMethod,
    };
  },
};
