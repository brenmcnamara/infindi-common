/* @flow */

import invariant from 'invariant';

import { createModelStub } from '../db-utils';
import { getFirebaseAdmin, getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub } from '../../types/core';
import type { ProviderFull as YodleeProviderFull } from '../../types/yodlee';

export type Provider = ModelStub<'Provider'> & {
  isDeprecated: bool,
  quirkCount: number,
  quirks: Array<string>,
  sourceOfTruth: {|
    +type: 'YODLEE',
    +value: YodleeProviderFull,
  |},
};

export type SourceOfTruth = {|
  +type: 'YODLEE',
  +value: YodleeProviderFull,
|};

export function getProvidersCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('Providers');
}

export function getProviderName(provider: Provider): string {
  invariant(
    provider.sourceOfTruth.type === 'YODLEE',
    'Expecting provider to come from YODLEE',
  );
  return provider.sourceOfTruth.value.name;
}

export function createProvider(
  sourceOfTruth: SourceOfTruth,
  quirks: Array<string>,
): Provider {
  return {
    ...createModelStub('Provider'),
    id: getIDFromSourceOfTruth(sourceOfTruth),
    isDeprecated: false,
    quirkCount: quirks.length,
    quirks,
    sourceOfTruth,
  };
}

export function genFetchProvider(id: ID): Promise<Provider | null> {
  return getProvidersCollection()
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genCreateProvider(provider: Provider): Promise<void> {
  return getProvidersCollection().set(provider.id, provider);
}

export function genUpdateProvider(provider: Provider): Promise<void> {
  return getProvidersCollection().update(provider.id, provider);
}

export function genUpsertProvider(provider: Provider): Promise<void> {
  return getProvidersCollection().set(provider.id, provider);
}

const BATCH_LIMIT = 100;

export function genUpsertProviders(providers: Array<Provider>): Promise<mixed> {
  return Promise.resolve().then(() => {
    const db = getFirebaseAdmin().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    providers.forEach(p => {
      const ref = getProvidersCollection().doc(p.id);
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

function getIDFromSourceOfTruth(sourceOfTruth: SourceOfTruth): ID {
  switch (sourceOfTruth.type) {
    case 'YODLEE': {
      return String(sourceOfTruth.value.id);
    }

    default:
      invariant(false, 'Unrecognized sourceOfTruth: %s', sourceOfTruth.type);
  }
}
