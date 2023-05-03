# Setup Module Integration Guide

Gr4vy Setup Module contains setup script for creating the following configurations in Commercetools:

- API Extensions
- Subscriptions
- Custom Fields

## Extension

Commercetools API Extensions extends behavior of an API with custom business logic. More details could be found here: [https://docs.commercetools.com/api/projects/api-extensions](https://docs.commercetools.com/api/projects/api-extensions)

The Gr4vy extension updates the cart to have the tax calculation mode to "UnitPriceLevel" when a cart is created. That is the tax calculation supported by most of the payment gateways.

HTTP type API Extension is used which points to `https://myextensiondomain.com/taxcalculationmode` URL in the Gr4vy Extension module. Use the URL in your extension server for the same.

## Subscriptions

Commercetools Subscriptions send notification messages when events happen in the Store. These messages are conveyed to a queue of your choice. More details can be found in [https://docs.commercetools.com/api/projects/subscriptions](https://docs.commercetools.com/api/projects/subscriptions)

Subscriptions are used in Gr4vy for integration of back-office operations like Capture, Refund and Void. You can link these actions to any event of your choice in Commercetools. The integration provides default implementations.

## Custom Fields

Custom fields are used to store Gr4vy specific information. The Transaction object contains these custom fields.

They are:

- transactionId: Gr4vy Transaction Id
- refundId: Gr4vy Refund Id
- response: Gr4vy Response

More information on Custom fields can be found here: [https://docs.commercetools.com/api/projects/custom-fields](https://docs.commercetools.com/api/projects/custom-fields)