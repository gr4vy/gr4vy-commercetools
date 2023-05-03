# Integration Guide

Gr4vy Configuration page is integrated with Commercetools as a Merchant Center Custom App. Once integrated, it can be accessed from a link in the left navigation in Merchant Center. More on Custom Applications could be found here: [https://docs.commercetools.com/merchant-center/managing-custom-applications](https://docs.commercetools.com/merchant-center/managing-custom-applications)

The Gr4vy configuration is saved as a Custom Object with key 'gr4vy-configuration'. The extension and notification modules fetch the custom object for their operations. Those applications cache the configuration to avoid fetching it again. When the configuration changes, the cache is automatically cleared.