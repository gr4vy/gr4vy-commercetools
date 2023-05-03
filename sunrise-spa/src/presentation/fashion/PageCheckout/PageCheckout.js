import BillingDetails from './BillingDetails/BillingDetails.vue';
import OrderOverview from './OrderOverview/OrderOverview.vue';
import ServerError from 'presentation/components/ServerError/ServerError.vue';
import {
  POST_EMBED_TOKEN,
  POST_UPDATE_BUYER,
  POST_RESTORE_CART,
  POST_UPDATE_PAYMENT
} from '../../../rest/paths';
import { cache } from '../../../apollo'
import { post } from '../../../rest/index';
import {
  CHARGE,
  AUTHORIZATION,
  GR4VY_STATE_WIDGET_LOADING,
  GR4VY_STATE_WIDGET_ERROR,
  GR4VY_STATE_PAYMENT_COMPONENT_READY_FLAG,
  GR4VY_FIELD_PAYMENT_TITLE,
  CUSTOMER,
  GR4vy_PAYMENT_METHOD,
  GR4VY_STATE_SHIPPING_SAVED_FLAG,
  GR4VY_STATE_LOAD_GR4VY_WIDGET_FLAG,
} from '../../../constants'

import { shallowRef, watch, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import useCart from 'hooks/useCart';
import useCartTools from 'hooks/useCartTools';
import { setup } from '@gr4vy/embed';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import useLocale from 'hooks/useLocale'

export default {
  components: {
    // CheckoutTopSection,
    OrderOverview,
    BillingDetails,
    ServerError,
    Loading,
  },
  setup() {
    const { t } = useI18n();
    const shippingMethod = shallowRef(null);
    const billingAddress = shallowRef(null);
    const shippingAddress = shallowRef(null);
    const validBillingForm = shallowRef(false);
    const validShippingForm = shallowRef(true);
    const showError = shallowRef(false);
    const error = shallowRef(null);
    const { cart, loading } = useCart();
    const cartTools = useCartTools();
    let gr4vyEmbed;
    const router = useRouter();
    const { locale } = useLocale();

    //record timestamp for refresh token.
    const tokenTimestamp = shallowRef(null);

    //Newly created order from Cart.
    const orderId = shallowRef(null);

    //Show loading spinner when order is submitted.
    const isOrderSubmitted = shallowRef(false);

    //PaymentMethod.vue component mounted
    const isPaymentComponentReady = ref(false)
    //Prevent Gr4vy widget token if shipping needs to be updated (concurrency error).
    const isShippingReady = ref(false);
    //Allow Widget to load only once.
    const loadGr4vyWidget = ref(true);
    //Flag to indicate that cart got updated due to generating G4vy token
    const isGr4vyTokenCartUpdated = shallowRef(false);
    //Flag if transaction failed. Don't re-render the widget or error message will be cleared.
    const isTransactionFailed = shallowRef(false)

    //Show loading spinner while loading Gr4vy widget
    const widgetLoading = ref(false);
    //Show error message if loading Gr4vy widget throws error.
    const widgetError = ref(false);

    //Payment Widget Title configured in Admin.
    const paymentTitle = shallowRef('Payment Title');

    provide(GR4VY_STATE_WIDGET_LOADING, widgetLoading);
    provide(GR4VY_STATE_WIDGET_ERROR, widgetError);
    provide(GR4VY_STATE_PAYMENT_COMPONENT_READY_FLAG, isPaymentComponentReady);
    provide(GR4VY_STATE_SHIPPING_SAVED_FLAG, isShippingReady);
    provide(GR4VY_STATE_LOAD_GR4VY_WIDGET_FLAG, loadGr4vyWidget)
    provide(GR4VY_FIELD_PAYMENT_TITLE, paymentTitle);

    //Logged in customer or Guest customer.
    const isLoggedIn = !!JSON.parse(localStorage.getItem(CUSTOMER))

    //@todo: what happened to the payment method passed to this?
    const saveAddress = async () => {
      if (!validBillingForm.value) {
        showError.value = true;
        return Promise.reject();
      }
      showError.value = false;
      return cartTools
        .setAddressForCart({
          billingAddress,
          shippingAddress,
        })
        .then(() => {
          return Promise.resolve();
        })
        .catch((e) => {
          error.value = e;
          return Promise.reject();
        });
    };

    //Load Gr4vy Widget configuration.
    const loadWidgetConfig = async () => {

      try {
        widgetLoading.value = true;
        const { result: config, errors} = await post(POST_EMBED_TOKEN, { locale: cart.locale});

        //save timestamp to detect expiry of embed token
        tokenTimestamp.value = Date.now();

        //Once token is generated, cart is updated. stop going in infinite loop.
        isGr4vyTokenCartUpdated.value = true;

        //If payment integration is disabled, don't show widget.
        if(!config.active) {
          widgetLoading.value = false;
          paymentTitle.value = "";
          return
        }
        if (errors) {
          console.error(errors);
          throw new Error(errors)
        }

        //generating the token modifies the cart, so need to clear apollo cache.
        cache.evict({ id: 'activeCart' });
        cache.gc();
        widgetLoading.value = false;
        paymentTitle.value = config.title
        setupGr4vyWidget(config);
        return config;
      }
      catch(e) {
        console.log("Error: ", e);
        widgetLoading.value = false;
        widgetError.value = true;
        throw new Error(e);
      }
    }

    //Render Gr4vy widget
    const setupGr4vyWidget = (
      {
        gr4vyId,
        buyerId,
        environment,
        amount,
        currency,
        country,
        embedToken,
        intent,
        cartItems,
        metadata,
        paymentStore,
        paymentSource,
        requiredSecurityCode,
        statementDescriptor,
        themeOptions,
      }
      ) => {

      //map Gr4vy intent to CT Transaction type.
      const IntentTransactionTypeMapping = {
        capture: CHARGE,
        authorize: AUTHORIZATION
      }

      //initialize the Gr4vy embed Widget.
      const embedConfig = {}
      embedConfig.gr4vyId = gr4vyId;
      embedConfig.buyerId = buyerId;
      embedConfig.environment = environment;
      embedConfig.element = ".gr4vycontainer";
      embedConfig.form = "#payment-form"
      embedConfig.amount = amount;
      embedConfig.currency = currency;
      embedConfig.country = country;
      embedConfig.token = embedToken;
      embedConfig.intent = intent;
      embedConfig.cartItems = cartItems;
      embedConfig.metadata = metadata;
      embedConfig.locale = locale.value;
      if (isLoggedIn && paymentStore) embedConfig.store = paymentStore == 'ask' ? paymentStore : !! paymentStore;
      else embedConfig.store = false; //don't show store payment details for guest users
      if (paymentSource) embedConfig.paymentSource = paymentSource;
      if (requiredSecurityCode) embedConfig.requireSecurityCode = !!requiredSecurityCode;
      if (statementDescriptor) embedConfig.statementDescriptor = statementDescriptor;
      if (themeOptions) embedConfig.theme = themeOptions;

      gr4vyEmbed = setup({
        ...embedConfig,

        //Before Transaction is created: Save Address, Update Buyer, Create Order from Cart.
        onBeforeTransaction: async ()=> {
          isOrderSubmitted.value = true;
          let buyerInfo;
          let refreshToken;
          try {
            await saveAddress();
            buyerInfo = await updateBuyer();

            //get new embed token if the existing one was created more than 1 hr ago.
            if (!validEmbedToken()) {
              const { result: { embedToken }, errors} = await post(POST_EMBED_TOKEN, { locale: cart.locale});
              if (errors) {
                console.error(errors);
                throw new Error(errors)
              }
              tokenTimestamp.value = Date.now();
              refreshToken = embedToken;
            }
          }
          catch(e) {
            //no need to restore cart as order is not yet submitted.
            console.error("Error: ", e)
            error.value = e;
            isOrderSubmitted.value = false;
            throw new Error(e);
          }

          //Place order
          try {
            const order = await cartTools.createMyOrderFromCart({
              method: GR4vy_PAYMENT_METHOD,
              cart: cart.value,
              type: IntentTransactionTypeMapping[intent]
            });
            cache.evict({ id: 'activeCart' });
            cache.gc();
            orderId.value = order?.data?.createMyOrderFromCart?.orderId;
            return ({
              externalIdentifier: orderId.value,
              shippingDetailsId: buyerInfo.shippingDetailsId,
              ...(refreshToken ? { token: refreshToken }:{})
            });
          }
          catch(e) {
            console.error("Error: ", e)
            error.value = e;
            await restoreCart();  //restore cart if order is submitted.
            throw new Error(e);
          }

        },

        //Completed Payment Transaction: Update Payment in order
        onComplete: async (transaction) => {
          console.log("Transaction: ", transaction);
          try {
            await updatePayment(transaction.id);
            isOrderSubmitted.value = false;
            router.push({
              name: 'pay',
              params: { method: GR4vy_PAYMENT_METHOD },
            });
          }
          catch(e) {
            console.error("Error: ", e)
            error.value = e;
            await restoreCart(transaction);
            throw new Error(e);
          }
        },

        //In case of an error event, restore cart, since order is already submitted.
        onEvent: async (name, data) => {
          console.log("Event Name: ", name, ", Data: ", data)
          switch (name) {
            case 'argumentError':
              widgetError.value = true;
              break;
            case 'transactionCreated':
              break;
            case 'transactionFailed':
              await restoreCart(data);
              break;
            case 'apiError':
              await restoreCart(data);
              break;
            case 'transactionCancelled':
              await restoreCart(data);
              break;
            default:
              break;
          }
        }
      });
    }

    //Hook to submit payment on Click of Submit Order Button.
    const placeOrder = () => {
      gr4vyEmbed.submit();
    };

    //order is already submitted. So recreate the cart from that order.
    const restoreCart = async (transaction) => {
      orderId.value && await post(POST_RESTORE_CART, {orderId: orderId.value, transaction});
      cache.evict({ id: 'activeCart' });
      cache.gc();
      isTransactionFailed.value = true;
      isOrderSubmitted.value = false;
    }

    //update order, payment and transaction based on transaction status
    const updatePayment = async (transactionId) => {
      const { errors } = await post(POST_UPDATE_PAYMENT, {gr4vyTransactionId: transactionId})
      if(errors) {
        console.error(errors);
        error.value = errors;
        throw new Error(errors);
      }
      cache.evict({ id: 'activeCart' });
      cache.gc();
    }

    //update buyer.
    const updateBuyer = async () => {
      const { result, errors } = await post(POST_UPDATE_BUYER, { locale: cart.value.locale});
      if(errors) {
        console.error(errors);
        throw new Error(errors);
      }

      //updating Buyer modifies the cart, so need to clear apollo cache.
      cache.evict({ id: 'activeCart' });
      cache.gc();

      return result;
    }

    //Check if the gr4vy embed token has expired.
    const validEmbedToken = () => {
      const tokeExpiry = 1 * 60 * 60 *1000; //1hr to milliseconds
      const current = Date.now();
      if ( (current - tokenTimestamp.value) > tokeExpiry) {
        return false;
      }
      return true;
    }

    watch([cart, loading], ([cart, loading]) => {
      if (!cart && !loading && !isOrderSubmitted.value) {
        router.replace({ path: '/' });
      }

      //If cart changes, unless it's order submit, regenerate the Gr4vy widget.
      if(cart && !loading && !isOrderSubmitted.value && !isGr4vyTokenCartUpdated.value && !isTransactionFailed.value) {
        loadGr4vyWidget.value = true;
        error.value = null;
      }

      //when the cart re-loads the first time after token is generated, reload it.
      if(isGr4vyTokenCartUpdated.value) isGr4vyTokenCartUpdated.value = false;

      //when the cart re-loads after a failed transaction, don't reload widget the first time, next time allow it.
      if(isTransactionFailed.value) isTransactionFailed.value = false;
    });

    //Once payment component is mounted and shipping updated, load widget once.
    watch([isPaymentComponentReady, isShippingReady, loadGr4vyWidget], async ([p, s, l]) => {
      if(p && s && l) {
        await loadWidgetConfig();
        loadGr4vyWidget.value = false;  //reset flag after loading widget.
      }
    })

    const setValidBillingForm = (valid) => {
      validBillingForm.value = valid;
    };
    const setValidShippingForm = (valid) => {
      validShippingForm.value = valid;
    };
    const updateBilling = (billingDetails) => {
      billingAddress.value = JSON.parse(
        JSON.stringify(billingDetails)
      );
    };
    const updateShipping = (shippingDetails) => {
      shippingAddress.value = JSON.parse(
        JSON.stringify(shippingDetails)
      );
    };
    const updateShippingMethod = (shippingId) => {
      shippingMethod.value = shippingId;
    };

    return {
      ...cartTools,
      shippingMethod,
      billingAddress,
      shippingAddress,
      validBillingForm,
      validShippingForm,
      showError,
      setValidBillingForm,
      setValidShippingForm,
      updateBilling,
      updateShipping,
      updateShippingMethod,
      error,
      cart,
      t,
      placeOrder,
      isOrderSubmitted,
    };
  },
};
