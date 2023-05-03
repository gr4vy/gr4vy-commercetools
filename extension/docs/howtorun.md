# How to run Extension Module

Follow the steps:

- Create .env file from [/extension/.env.sample](/extension/.env.sample)
- Create an API client from your Commercetools project with scope: TBD
- Update the 'commercetools config' section in the .env file with API client information.
- Update APP_CORS_ALLOWED_HOSTS with your store front domain.
- Update 'logger' section in the .env file with suitable values.
- Deploy your application using one of the following methods:
  - Build and Deploy the docker file in the module.
  - Copy the extension and common folder to a VM and build them by running `npm run build` command. Then start the server by running `npm start`
