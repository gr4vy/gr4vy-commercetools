# Commercetools-Gr4vy Integration

- Supported features
- Overview
- Setup Module
- Merchant Center Custom App
- Extension Module
- Notification Module

## Supported features

- Integration of Gr4vy widget to Merchant Storefront.
- Configure the Integration through Merchant Center.
- Webhooks
- Capture a Payment
- Refund a Payment
- Void a Payment

## Overview

![Gr4vy Integration Overview](/docs/images/Architecture.jpg "Gr4vy Integration")

## Setup Module

Running the setup module will setup the Gr4vy integration against the Commercetools project.

- Refer to [Integration Guide](/setup/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/setup//docs/howtorun.md) the setup module.

## Merchant Center Custom App

The mc-custom-app module is Commercetool's Custom App. It is a react application and hosted in a merchant's server. The url of the Custom App is registered in the Merchant Center and show up in the left navigation.

![Gr4vy Merchant Center Custom App](/docs/images/MC-Custom-App.png "Gr4vy Custom App")

- Refer to [Integration Guide](/mc-custom-app/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/mc-custom-app/docs/howtorun.md) the Custom App module.

## Extension Module

This module contains the frontend integrations with Gr4vy.

- Refer to [Integration Guide](/extension/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/extension/docs/howtorun.md) the Extension module.

## Notification Module

This module contains the back office integrations with Gr4vy.

- Refer to [Integration Guide](/notification/docs/integrationguide.md) on how to integrate your shop with this module.
- Refer to [How to run](/notification/docs/howtorun.md) the Extension module.

## Store front Integration

Each merchant will have their own implementation of Storefront. So we have used the demo storefront provided by Commercetools, the [Sunrise SPA] for sample integration. The modified files for the integration could be found here: [/sunrise-spa](/sunrise-spa/) You can model the integration for your storefront in the same line. The majority of integration code is in the file [/sunrise-spa/src/presentation/fashion/PageCheckout/PageCheckout.js](/sunrise-spa/src/presentation/fashion/PageCheckout/PageCheckout.js)
