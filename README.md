# Commercetools-Gr4vy Integration

- [Supported features](#supported-features)
- [Overview](#overview)
- [Setup Module](#setup-module)
- [Merchant Center Custom App](#merchant-center-custom-app)
- [Extension Module](#extension-module)
- [Notification Module](#notification-module)
- [Store front Integration](#store-front-integration)

## Supported features

The following features are supported by the Integration:

- Configure the Gr4vy widget through Merchant Center.
- Handle Webhooks
- Capture a Payment
- Refund a Payment
- Void a Payment
- Sample Integration of Gr4vy widget to Merchant Storefront in Sunrise SPA.

## Overview

![Gr4vy Integration Overview](/docs/images/Architecture.jpg "Gr4vy Integration")

## Setup Module

Running the setup module will setup the Gr4vy integration against the Commercetools project.

- Refer to [Integration Guide](/setup/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/setup//docs/howtorun.md) the setup module.

## Merchant Center Custom App

The mc-custom-app module is Commercetool's Custom App. It is a react application generated using the Commercetools Custom App framework and has to be hosted in your server. Once The url of the Custom App is registered in the Merchant Center and Menu to access the page will show up in the left navigation.

![Gr4vy Merchant Center Custom App](/docs/images/MC-Custom-App.png "Gr4vy Custom App")

- Refer to [Integration Guide](/mc-custom-app/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/mc-custom-app/docs/howtorun.md) the Custom App module.

## Extension Module

This module contains the frontend integrations with Gr4vy. It provides APIs to interact with the Store front. It also has API to handle webhook calls from Gr4vy.

- Refer to [Integration Guide](/extension/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/extension/docs/howtorun.md) the Extension module.

## Notification Module

This module contains the back office integrations with Gr4vy. This module provide handler functions to handle to various Void, Capture and Refund messages from Commercetools using Commercetools Subscription.

- Refer to [Integration Guide](/notification/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/notification/docs/howtorun.md) the Extension module.

## Store front Integration

Each merchant will have their own implementation of Storefront in their choice of technology. We have used the storefront provided by Commercetools, the [Sunrise SPA](https://github.com/commercetools/sunrise-spa) for demonstration of integration. 

The Sunrise SPA store front is in Vue js. The modified files for the Gr4vy integration can be found in this folder: [/sunrise-spa](/sunrise-spa/) You can model the integration for your store front in the same line. The majority of integration code is in the file:

[sunrise-spa/src/presentation/fashion/PageCheckout/PageCheckout.js](/sunrise-spa/src/presentation/fashion/PageCheckout/PageCheckout.js)
