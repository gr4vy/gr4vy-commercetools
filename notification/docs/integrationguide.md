# Notification Module Integration Guide

The Notification module interacts with the Back office and Gr4vy for integration. The flows are depicted in this diagram:

![Notification Flows](/notification/docs/images/Notification.jpg "Notification Flows")

When a Subscribed event happen in Commercetools, a subscription message is posted in the queue. The notification module, which is deployed as a serverless function and configured to be triggered on arrival of the message in the queue, will be triggered and it will process the message and make API calls to Gr4vy.

## Demonstration of back-office actions

Commercetools Merchant Center doesn't have a direct functionality to capture, void or refund a payment. Hence for demonstration purpose, these actions are linked to actions that are available in Merchant Center, using Commercetools Subscription Messages. You can link these actions to any events of your choice.

Additionally, you can modify the logic of calculating the amount to capture or refund by modifying/replacing a model class which has the business logic of calculating the amount.

Following are the Merchant Centre actions and corresponding Gr4vy back office actions:

|Merchant Center Action | Gr4vy Action         | Model Class | Description
---------------------- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------|
|Add Delivery to an Order with Authorized Payment| Capture of the whole Payment | [order.capture.details.ts](/notification/src/model/order/capture/order.capture.details.ts)            | When a delivery is added against an order with Authorized payment, Capture of the whole Payment amount is done. Even though, Gr4vy supports partial capture, only one capture is allowed. Hence using this logic.|
|Add Return to a Order with Captured Payment| Refund of the amount corresponding to the returned item | [order.refund.details.ts](/notification/src/model/order/refund/order.refund.details.ts) | When an item in an order is returned, the amount corresponding to the returned item is refunded in Gr4vy |
|Cancel an Order with Authorized Payment | Void the payment against the order | [order.void.details.ts](/notification/src/model/order/void/order.void.details.ts) | When an order with Authorized payment is cancelled (Status of the order is changed to 'cancelled'), the payment against the order is made void in Gr4vy|
