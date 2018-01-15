/* @flow */

import Config from '../config';

import { createModelStub } from '../db-utils';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { Provider as RawProvider } from '../../types/yodlee';

export type Provider = ModelStub<'YodleeProvider'> & {
  isDeprecated: bool,
  raw: RawProvider,
  userRef: Pointer<'User'>,
};

export function createProvider(raw: RawProvider, userID: ID): Provider {
  return {
    ...createModelStub('YodleeProvider'),
    id: String(raw.id), // TODO: In the future, this will change to be type string.
    isDeprecated: false,
    raw,
    userRef: {
      pointerType: 'User',
      type: 'POINTER',
      refID: userID,
    },
  };
}

export function genFetchProvider(id: ID): Promise<Provider | null> {
  return Config.getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeProviders')
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genCreateProvider(provider: Provider): Promise<void> {
  return Config.getFirebaseAdmin()
    .collection('YodleeProviders')
    .set(provider.id, provider);
}

export function genUpdateProvider(provider: Provider): Promise<void> {
  return Config.getFirebaseAdmin()
    .collection('YodleeProviders')
    .update(provider.id, provider);
}
