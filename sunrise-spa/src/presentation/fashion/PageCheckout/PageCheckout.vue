<style src="./PageCheckout.scss" lang="scss"></style>
<script src="./PageCheckout.js"></script>
<i18n src="./PageCheckout.txt" lang="yaml"></i18n>

<template>
  <span>
    <div
      class="checkout-main-area pt-130 pb-100"
    >
      <div class="container">
        <div class="checkout-wrap">
          <div class="row">
            <div class="col-lg-7">
              <BillingDetails
                :billingAddress="billingAddress"
                :shippingAddress="shippingAddress"
                @update-billing-details="updateBilling"
                @update-shipping-details="updateShipping"
                @valid-billing-form="setValidBillingForm"
                @valid-shipping-form="setValidShippingForm"
              />
            </div>
            <div class="col-lg-5">
              <OrderOverview
                @update-shipping="updateShippingMethod"
                :showError="showError"
                :cart="cart"
                :placeOrder="placeOrder"
              />
              <loading v-model:active="isOrderSubmitted"
                :can-cancel="false"
               :is-full-page="true"
               :z-index="99"
               />
              <!-- <Pay v-if="loadCart"/> -->
              <ServerError
                :error="error"
                class="server-error"
                >{{ 'unknownError' }}</ServerError
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
