// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import config from './gr4vy.config.json';

export const entryPointUriPath = config.ENTRY_POINT;

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
