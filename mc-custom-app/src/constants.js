// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';
import config from './components/gr4vy/gr4vy.config.json';

export const entryPointUriPath = config.ENTRY_POINT;

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
