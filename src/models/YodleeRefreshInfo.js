/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { Account } from './Account';
import type { ID, ModelStub, Pointer } from '../../types/core';
import type { JobSchedule } from './Job';
import type { RefreshInfo as RawRefreshInfo } from '../../types/yodlee';

export type YodleeRefreshInfo = ModelStub<'YodleeRefreshInfo'> & {
  +providerAccountID: ID,
  +providerRef: Pointer<'YodleeProvider'>,
  +raw: RawRefreshInfo,
  +userRef: Pointer<'User'>,
};

const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

export function getYodleeRefreshInfoCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo');
}

export function createRefreshInfo(
  raw: RawRefreshInfo,
  userID: ID,
  providerID: ID,
  providerAccountID: ID,
): YodleeRefreshInfo {
  return {
    ...createModelStub('YodleeRefreshInfo'),
    providerAccountID,
    providerRef: createPointer('YodleeProvider', providerID),
    raw,
    userRef: createPointer('User', userID),
  };
}

export function updateRefreshInfo(
  refreshInfo: YodleeRefreshInfo,
  raw: RawRefreshInfo,
): YodleeRefreshInfo {
  const now = new Date();
  return {
    ...refreshInfo,
    raw,
    updatedAt: now,
  };
}

export function genFetchRefreshInfo(id: ID): Promise<YodleeRefreshInfo | null> {
  return getYodleeRefreshInfoCollection()
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genFetchRefreshInfoForUser(
  userID: ID,
): Promise<Array<YodleeRefreshInfo>> {
  return getYodleeRefreshInfoCollection()
    .where('userRef.refID', '==', userID)
    .get()
    .then(snapshot => {
      const refreshInfo = [];
      snapshot.docs.forEach(doc => {
        if (doc.exists) {
          refreshInfo.push(doc.data());
        }
      });
      return refreshInfo;
    });
}

export function genFetchRefreshInfoForProvider(
  userID: ID,
  providerID: ID,
): Promise<YodleeRefreshInfo | null> {
  return getYodleeRefreshInfoCollection()
    .where('userRef.refID', '==', userID)
    .where('providerRef.refID', '==', providerID)
    .get()
    .then(snapshot => {
      return snapshot.docs.length > 0 && snapshot.docs[0].exists
        ? snapshot.docs[0].data()
        : null;
    });
}

export function genCreateRefreshInfo(
  refreshInfo: YodleeRefreshInfo,
): Promise<void> {
  return getYodleeRefreshInfoCollection()
    .doc(refreshInfo.id)
    .set(refreshInfo);
}

export function genUpdateRefreshInfo(
  refreshInfo: YodleeRefreshInfo,
): Promise<void> {
  return getYodleeRefreshInfoCollection()
    .doc(refreshInfo.id)
    .update(refreshInfo);
}

export function getProviderID(refreshInfo: YodleeRefreshInfo): ID {
  return refreshInfo.providerRef.refID;
}

export function isPendingStatus(refreshInfo: YodleeRefreshInfo): bool {
  return !refreshInfo.raw.status;
}

export function isInProgress(refreshInfo: YodleeRefreshInfo): bool {
  return refreshInfo.raw.status === 'IN_PROGRESS';
}

export function isComplete(refreshInfo: YodleeRefreshInfo): bool {
  return (
    refreshInfo.raw.status === 'SUCCESS' ||
    refreshInfo.raw.status === 'PARTIAL_SUCCESS'
  );
}

export function didFail(refreshInfo: YodleeRefreshInfo): bool {
  return refreshInfo.raw.status === 'FAILED';
}

export function includesAccount(
  refreshInfo: YodleeRefreshInfo,
  account: Account,
): bool {
  const { sourceOfTruth } = account;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'includesAccounts only works for YODLEE accounts',
  );
  return sourceOfTruth.value.providerId === refreshInfo.providerRef.refID;
}

export function createRefreshSchedule(
  refreshInfo: YodleeRefreshInfo,
): JobSchedule {
  if (isPendingStatus(refreshInfo)) {
    return {
      recurringType: 'ONCE',
      runAt: new Date(Date.now() + MILLIS_PER_SECOND * 5),
    };
  } else if (isInProgress(refreshInfo)) {
    return {
      recurringType: 'ONCE',
      runAt: new Date(Date.now() + MILLIS_PER_SECOND * 30),
    };
  } else if (refreshInfo.raw.nextRefreshScheduled) {
    const runAt = new Date(Date.parse(refreshInfo.raw.nextRefreshScheduled));
    return {
      recurringType: 'ONCE',
      runAt,
    };
  }
  return {
    recurringType: 'ONCE',
    runAt: new Date(Date.now() + MILLIS_PER_DAY * 1.0),
  };
}
