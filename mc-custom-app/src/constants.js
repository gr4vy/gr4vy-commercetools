// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import config from './gr4vy.config.json';

export const entryPointUriPath = config.ENTRY_POINT;

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const gravyStatementDescriptorValidator = {
  url: {
    min: 1,
    max: 13,
  },
  city: {
    min: 1,
    max: 13,
  },
  name: {
    min: 5,
    max: 22,
  },
  phone: {
    min: 5,
    max: 20,
  },
};
