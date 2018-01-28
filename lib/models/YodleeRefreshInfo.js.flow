/* @flow */

import { createModelStub } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { RefreshInfo } from '../../types/yodlee';

export type YodleeRefreshInfo = ModelStub<'YodleeRefreshInfo'> & {
  +providerAccountID: ID,
  +providerRef: Pointer<'YodleeProvider'>,
  +raw: RefreshInfo,
  +userRef: Pointer<'User'>,
};

export function createRefreshInfo(
  raw: RefreshInfo,
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

export function genFetchRefreshInfo(id: ID): Promise<YodleeRefreshInfo | null> {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeRefreshInfo')
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
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
