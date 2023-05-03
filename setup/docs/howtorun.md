# How to run Setup Module

Follow the below steps to run the setup:

- Create an API Client in your Commercetools Project. It should have the following scopes: manage_extensions, manage_subscriptions and manage_types.
- Create a copy of the .env.sample and rename it as .env in the setup folder.
- Update the "commercetools config" section using the API client details generated above.
- Set the subscription queue type: AWS or GCP or Other.
- If you set AWS above, then you got to have an SQS queue and configure the "AWS SQS Queue Configuration" section.
- If you use GCP as type above, then you got to have a Google Cloud PubSub queue and configure the "GCP Configuration" section.
- If you use type as Other, then you will have to create the subscription yourself.
- Configure the extension configuration. The extension URL will point to the Extension server and will have a value `https://yourextensiondomain.com/taxcalculationmode` and auth header can have a value `Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==`
- Go to the common folder: `npm run setup`
- Go to the setup folder and run the command `npm run build` and then `npm start`.
- A success message will be displayed.
