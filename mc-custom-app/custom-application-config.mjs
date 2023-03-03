import { PERMISSIONS, entryPointUriPath } from './src/constants';
import gr4vyConfig from './src/components/gr4vy/gr4vy.config.json';
/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Gr4vy',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'gr4vy',
    },
    production: {
      applicationId: 'TODO',
      url: 'https://your_app_hostname.com',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  headers: {
    csp: {
      'connect-src': [gr4vyConfig.API_SERVER_URL],
      'frame-src': [gr4vyConfig.API_SERVER_URL],
      'script-src': [gr4vyConfig.API_SERVER_URL],
    },
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Gr4vy',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'config',
      defaultLabel: 'Payment Configuration',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
