/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { ProviderAccount as YodleeProviderAccount } from '../../types/yodlee';

export type AccountLink = ModelStub<'AccountLink'> & {
  +providerRef: Pointer<'Provider'>,
  +sourceOfTruth: SourceOfTruth,
  +userRef: Pointer<'User'>,
};

export type SourceOfTruth = {|
  +providerAccount: YodleeProviderAccount,
  +type: 'YODLEE',
|};

export function getAccountLinkCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('AccountLink');
}

export function createAccountLink(
  sourceOfTruth: SourceOfTruth,
  userID: ID,
  providerID: ID,
): AccountLink {
  return {
    ...createModelStub('AccountLink'),
    providerRef: createPointer('Provider', providerID),
    sourceOfTruth,
    userRef: createPointer('User', userID),
  };
}

export function createAccountLinkYodlee(
  yodleeProviderAccount: YodleeProviderAccount,
  userID: ID,
  providerID: ID,
): AccountLink {
  const sourceOfTruth = {
    providerAccount: yodleeProviderAccount,
    type: 'YODLEE',
  };
  return createAccountLink(sourceOfTruth, userID, providerID);
}

export function updateAccountLink(
  accountLink: AccountLink,
  sourceOfTruth: SourceOfTruth,
): AccountLink {
  const now = new Date();
  return {
    ...accountLink,
    sourceOfTruth,
    updatedAt: now,
  };
}

export function updateAccountLinkYodlee(
  accountLink: AccountLink,
  yodleeProviderAccount: YodleeProviderAccount,
): AccountLink {
  const { sourceOfTruth } = accountLink;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting refresh info to come from YODLEE',
  );
  const newSourceOfTruth = {
    providerAccount: yodleeProviderAccount,
    type: 'YODLEE',
  };
  return updateAccountLink(accountLink, newSourceOfTruth);
}

export function genFetchAccountLink(id: ID): Promise<AccountLink | null> {
  return getAccountLinkCollection()
    .doc(id)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genFetchAccountLinksForUser(
  userID: ID,
): Promise<Array<AccountLink>> {
  return getAccountLinkCollection()
    .where('userRef.refID', '==', userID)
    .get()
    .then(snapshot => {
      const accountLinks = [];
      snapshot.docs.forEach(doc => {
        if (doc.exists) {
          accountLinks.push(doc.data());
        }
      });
      return accountLinks;
    });
}

export function genFetchAccountLinkForProvider(
  userID: ID,
  providerID: ID,
): Promise<AccountLink | null> {
  return getAccountLinkCollection()
    .where('userRef.refID', '==', userID)
    .where('providerRef.refID', '==', providerID)
    .get()
    .then(snapshot => {
      return snapshot.docs.length > 0 && snapshot.docs[0].exists
        ? snapshot.docs[0].data()
        : null;
    });
}

export function genCreateAccountLink(accountLink: AccountLink): Promise<void> {
  return getAccountLinkCollection()
    .doc(accountLink.id)
    .set(accountLink);
}

export function genUpdateRefreshInfo(accountLink: AccountLink): Promise<void> {
  return getAccountLinkCollection()
    .doc(accountLink.id)
    .update(accountLink);
}

export function genDeleteAccountLink(id: ID): Promise<void> {
  return getAccountLinkCollection()
    .doc(id)
    .delete();
}

export function isLinking(accountLink: AccountLink): bool {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(
    !providerAccount ||
      !providerAccount.refreshInfo.status ||
      providerAccount.refreshInfo.status === 'IN_PROGRESS',
  );
}

export function isLinkSuccess(accountLink: AccountLink): bool {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(
    providerAccount &&
      (providerAccount.refreshInfo.status === 'SUCCESS' ||
        providerAccount.refreshInfo.status === 'PARTIAL_SUCCESS'),
  );
}

export function isLinkFailure(accountLink: AccountLink): bool {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(
    providerAccount && providerAccount.refreshInfo.status === 'FAILED',
  );
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function getYodleeProviderAccount(
  accountLink: AccountLink,
): YodleeProviderAccount {
  const { sourceOfTruth } = accountLink;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting account link to come from YODLEE',
  );
  return sourceOfTruth.providerAccount;
}
