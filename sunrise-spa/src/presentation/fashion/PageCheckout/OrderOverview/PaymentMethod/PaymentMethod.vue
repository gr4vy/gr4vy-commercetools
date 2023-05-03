<script src="./PaymentMethod.js"></script>
<i18n src="./PaymentMethod.txt" lang="yaml"></i18n>

<template>
  <span>
  <loading v-model:active="widgetLoading"
    :can-cancel="false"
    :is-full-page="false"/>
    <div class="checkout-shipping-content">
      <div class="shipping-content-left">
        <span class="bold-text">{{
          t(paymentTitle)
        }}</span>
      </div>
    </div>

    <div class="payment-method">
      <div class="pay-top sin-payment">
        <form id="payment-form">
            <div class="gr4vycontainer">
              <span style="color:red" v-if="gr4vyWidgetError">{{t('An error occurred. Please try again!')}}</span>
            </div>
          </form>
      </div>
    </div>
  </span>
</template>
