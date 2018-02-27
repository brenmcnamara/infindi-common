/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { Account } from './Account';
import type { ID, ModelStub, Pointer } from '../../types/core';
import type { JobSchedule } from './Job';
import type { RefreshInfo as YodleeRefreshInfo } from '../../types/yodlee';

export type RefreshInfo = ModelStub<'RefreshInfo'> & {
  +providerRef: Pointer<'Provider'>,
  +sourceOfTruth: SourceOfTruth,
  +userRef: Pointer<'User'>,
};

export type SourceOfTruth = {|
  +type: 'YODLEE',
  +providerAccountID: ID,
  +value: YodleeRefreshInfo,
|};

const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

export function getRefreshInfoCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('RefreshInfo');
}

export function createRefreshInfo(
  sourceOfTruth: SourceOfTruth,
  userID: ID,
  providerID: ID,
): RefreshInfo {
  return {
    ...createModelStub('RefreshInfo'),
    providerRef: createPointer('Provider', providerID),
    sourceOfTruth,
    userRef: createPointer('User', userID),
  };
}

export function updateRefreshInfo(
  refreshInfo: RefreshInfo,
  sourceOfTruth: SourceOfTruth,
): RefreshInfo {
  const now = new Date();
  return {
    ...refreshInfo,
    sourceOfTruth,
    updatedAt: now,
  };
}

export function updateRefreshInfoYodlee(
  refreshInfo: RefreshInfo,
  yodleeRefreshInfo: YodleeRefreshInfo,
): RefreshInfo {
  const { sourceOfTruth } = refreshInfo;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting refresh info to come from YODLEE',
  );
  const newSourceOfTruth = {
    providerAccountID: sourceOfTruth.providerAccountID,
    type: 'YODLEE',
    value: yodleeRefreshInfo,
  };
  return updateRefreshInfo(refreshInfo, newSourceOfTruth);
}

export function genFetchRefreshInfo(id: ID): Promise<RefreshInfo | null> {
  return getRefreshInfoCollection()
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genFetchRefreshInfoForUser(
  userID: ID,
): Promise<Array<RefreshInfo>> {
  return getRefreshInfoCollection()
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
): Promise<RefreshInfo | null> {
  return getRefreshInfoCollection()
    .where('userRef.refID', '==', userID)
    .where('providerRef.refID', '==', providerID)
    .get()
    .then(snapshot => {
      return snapshot.docs.length > 0 && snapshot.docs[0].exists
        ? snapshot.docs[0].data()
        : null;
    });
}

export function genCreateRefreshInfo(refreshInfo: RefreshInfo): Promise<void> {
  return getRefreshInfoCollection()
    .doc(refreshInfo.id)
    .set(refreshInfo);
}

export function genUpdateRefreshInfo(refreshInfo: RefreshInfo): Promise<void> {
  return getRefreshInfoCollection()
    .doc(refreshInfo.id)
    .update(refreshInfo);
}

export function genDeleteRefreshInfo(id: ID): Promise<void> {
  return getRefreshInfoCollection()
    .doc(id)
    .delete();
}

export function getProviderID(refreshInfo: RefreshInfo): ID {
  return refreshInfo.providerRef.refID;
}

export function isPendingStatus(refreshInfo: RefreshInfo): bool {
  const yodleeRefreshInfo = getYodleeRefreshInfo(refreshInfo);
  return !yodleeRefreshInfo.status;
}

export function isInProgress(refreshInfo: RefreshInfo): bool {
  const yodleeRefreshInfo = getYodleeRefreshInfo(refreshInfo);
  return yodleeRefreshInfo.status === 'IN_PROGRESS';
}

export function isComplete(refreshInfo: RefreshInfo): bool {
  const yodleeRefreshInfo = getYodleeRefreshInfo(refreshInfo);
  return (
    yodleeRefreshInfo.status === 'SUCCESS' ||
    yodleeRefreshInfo.status === 'PARTIAL_SUCCESS'
  );
}

export function didFail(refreshInfo: RefreshInfo): bool {
  const yodleeRefreshInfo = getYodleeRefreshInfo(refreshInfo);
  return yodleeRefreshInfo.status === 'FAILED';
}

export function includesAccount(
  refreshInfo: RefreshInfo,
  account: Account,
): bool {
  const { sourceOfTruth } = account;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'includesAccounts only works for YODLEE accounts',
  );
  return sourceOfTruth.value.providerId === refreshInfo.providerRef.refID;
}

export function createRefreshSchedule(refreshInfo: RefreshInfo): JobSchedule {
  const yodleeRefreshInfo = getYodleeRefreshInfo(refreshInfo);
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
  }

  if (yodleeRefreshInfo.nextRefreshScheduled) {
    const runAtUpperBound = new Date(
      Date.parse(yodleeRefreshInfo.nextRefreshScheduled),
    );
    const runAtOneDay = new Date(Date.now() + MILLIS_PER_DAY * 1.0);
    return {
      recurringType: 'ONCE',
      runAt:
        runAtUpperBound.getTime() < runAtOneDay.getTime()
          ? runAtUpperBound
          : runAtOneDay,
    };
  }

  return {
    recurringType: 'ONCE',
    runAt: new Date(Date.now() + MILLIS_PER_DAY * 1.0),
  };
}

function getYodleeRefreshInfo(refreshInfo: RefreshInfo): YodleeRefreshInfo {
  const { sourceOfTruth } = refreshInfo;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting refresh info to come from YODLEE',
  );
  return sourceOfTruth.value;
}
