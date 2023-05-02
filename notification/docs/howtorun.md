# How to run

Follow the steps:

- Configure the environment variables with either one of the following methods:
  - Create .env file from [/notification/.env.sample](/notification/.env.sample)
  - Create environment variables in the serverless function of your cloud provider.
- Create an API client from your Commercetools project with scope: TBD
- Update the 'commercetools config' variables with API client information.
- Update 'logger' section in the .env file with suitable values.
- Create a deployment file by running one of the following commands based on your serverless provider:
  - For AWS: `npm run zip-lambda-function`
  - For GCP: `npm run zip-google-function`
  - For others, you will have create them yourself.
- Upload the deployment file to the serverless cloud.
