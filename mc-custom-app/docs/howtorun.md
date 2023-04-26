# How to run

Following steps to run the Merchant Center:

- Update the configuration files in mc-custom-app:
  - [/mc-custom-app/custom-application-config.mjs](/mc-custom-app/custom-application-config.mjs). The applicationId (This is generated when you register custom App) and url in the production configuration.
  - [/mc-custom-app/src/gr4vy.config.json](/mc-custom-app/src/gr4vy.config.json). The API_SERVER_URL should point to the Extension application URL.
- Deploy the merchant center custom app, using one of the below methods:

  - Build and run the Docker file [/mc-custom-app/Dockerfile.prod](/mc-custom-app/Dockerfile.prod)
  - Copy the mc-custom-app folder to a VM and run the command in a server: `npm run start:prod:local`
  - Build the module mc-custom-app by running `npm run build` in it's root and copy the folder /build/public to the document root of a webserver.

- Register the web application as a Custom App in Merchant Center. More details on the same could be found at [https://docs.commercetools.com/merchant-center/managing-custom-applications](https://docs.commercetools.com/merchant-center/managing-custom-applications)
