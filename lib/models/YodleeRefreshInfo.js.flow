/* @flow */

import { createModelStub } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { RefreshInfo as RawRefreshInfo } from '../../types/yodlee';

export type YodleeRefreshInfo = ModelStub<'YodleeRefreshInfo'> & {
  +providerAccountID: ID,
  +providerRef: Pointer<'YodleeProvider'>,
  +raw: RawRefreshInfo,
  +userRef: Pointer<'User'>,
};

export function createRefreshInfo(
  raw: RawRefreshInfo,
  userID: ID,
  providerID: ID,
  providerAccountID: ID,
): YodleeRefreshInfo {
  return {
    ...createModelStub('YodleeRefreshInfo'),
    providerAccountID,
    providerRef: {
      pointerType: 'YodleeProvider',
      refID: providerID,
      type: 'POINTER',
    },
    raw,
    userRef: {
      pointerType: 'User',
      refID: userID,
      type: 'POINTER',
    },
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
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo')
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genFetchRefreshInfoForUser(
  userID: ID,
): Promise<Array<YodleeRefreshInfo>> {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo')
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

export function genCreateRefreshInfo(
  refreshInfo: YodleeRefreshInfo,
): Promise<void> {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo')
    .doc(refreshInfo.id)
    .set(refreshInfo);
}

export function genUpdateRefreshInfo(
  refreshInfo: YodleeRefreshInfo,
): Promise<void> {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo')
    .doc(refreshInfo.id)
    .update(refreshInfo);
}

export function isPending(refreshInfo: YodleeRefreshInfo): bool {
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
