/* @flow */

import { createModelStub } from '../db-utils';
import { getFirebaseAdmin, getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub } from '../../types/core';
import type { ProviderFull as RawProviderFull } from '../../types/yodlee';

export type Provider = ModelStub<'YodleeProvider'> & {
  isDeprecated: bool,
  raw: RawProviderFull,
};

export function createProvider(raw: RawProviderFull): Provider {
  return {
    ...createModelStub('YodleeProvider'),
    id: String(raw.id), // TODO: In the future, this will change to be type string.
    isDeprecated: false,
    raw,
  };
}

export function genFetchProvider(id: ID): Promise<Provider | null> {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeProviders')
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genCreateProvider(provider: Provider): Promise<void> {
  return getFirebaseAdmin()
    .collection('YodleeProviders')
    .set(provider.id, provider);
}

export function genUpdateProvider(provider: Provider): Promise<void> {
  return getFirebaseAdmin()
    .collection('YodleeProviders')
    .update(provider.id, provider);
}

export function genUpsertProvider(provider: Provider): Promise<void> {
  return getFirebaseAdmin()
    .collection('YodleeProviders')
    .set(provider.id, provider);
}

const BATCH_LIMIT = 100;

export function genUpsertProviders(providers: Array<Provider>): Promise<mixed> {
  return Promise.resolve().then(() => {
    const db = getFirebaseAdmin().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    providers.forEach(p => {
      const ref = db.collection('YodleeProviders').doc(p.id);
      currentBatch.set(ref, p);
      ++batchCount;
      if (batchCount > BATCH_LIMIT) {
        currentBatch = db.batch();
        batches.push(currentBatch);
      }
    });
    return Promise.all(batches.map(b => b.commit()));
  });
}
