/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type {
  LoginForm as YodleeLoginForm,
  ProviderAccount as YodleeProviderAccount,
} from '../../types/yodlee';

export type AccountLink = ModelStub<'AccountLink'> & {
  +providerRef: Pointer<'Provider'>,
  +sourceOfTruth: SourceOfTruth,
  +status: AccountLinkStatus,
  +userRef: Pointer<'User'>,
};

export type SourceOfTruth = {|
  +loginForm: YodleeLoginForm | null,
  +providerAccount: YodleeProviderAccount,
  +type: 'YODLEE',
|};

export type AccountLinkStatus =
  | 'FAILURE / BAD_CREDENTIALS'
  | 'FAILURE / EXTERNAL_SERVICE_FAILURE'
  | 'FAILURE / INTERNAL_SERVICE_FAILURE'
  | 'FAILURE / MFA_FAILURE'
  | 'IN_PROGRESS / INITIALIZING'
  | 'IN_PROGRESS / VERIFYING_CREDENTIALS'
  | 'IN_PROGRESS / DOWNLOADING_DATA'
  | 'MFA / PENDING_USER_INPUT'
  | 'MFA / WAITING_FOR_LOGIN_FORM'
  | 'SUCCESS';

export function getAccountLinkCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('AccountLinks');
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
    status: calculateAccountLinkStatus(sourceOfTruth),
    userRef: createPointer('User', userID),
  };
}

export function createAccountLinkYodlee(
  yodleeProviderAccount: YodleeProviderAccount,
  userID: ID,
  providerID: ID,
): AccountLink {
  const sourceOfTruth = {
    loginForm:
      yodleeProviderAccount.additionalStatus === 'USER_INPUT_REQUIRED'
        ? yodleeProviderAccount.loginForm || null
        : null,
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
  const newAccountLink: AccountLink = {
    ...accountLink,
    sourceOfTruth,
    status: calculateAccountLinkStatus(sourceOfTruth),
    updatedAt: now,
  };
  return newAccountLink;
}

export function updateAccountLinkStatus(
  accountLink: AccountLink,
  status: AccountLinkStatus,
): AccountLink {
  const now = new Date();
  const newAccountLink: AccountLink = {
    ...accountLink,
    status,
    updatedAt: now,
  };
  return newAccountLink;
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
  const loginForm =
    yodleeProviderAccount.refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED'
      ? yodleeProviderAccount.loginForm || getYodleeLoginForm(accountLink)
      : null;
  const newSourceOfTruth = {
    loginForm,
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
  return accountLink.status.startsWith('IN_PROGRESS');
}

export function isPendingUserInput(accountLink: AccountLink): bool {
  return accountLink.status === 'MFA / PENDING_USER_INPUT';
}

export function isLinkSuccess(accountLink: AccountLink): bool {
  return accountLink.status.startsWith('SUCCESS');
}

export function isLinkFailure(accountLink: AccountLink): bool {
  return accountLink.status.startsWith('FAILURE');
}

export function isInMFA(accountLink: AccountLink): bool {
  return accountLink.status.startsWith('MFA');
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function calculateAccountLinkStatus(
  sourceOfTruth: SourceOfTruth,
): AccountLinkStatus {
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Calculating account link status only supports yodlee',
  );
  const { refreshInfo } = sourceOfTruth.providerAccount;
  const { loginForm } = sourceOfTruth;

  if (!refreshInfo.status) {
    return 'IN_PROGRESS / INITIALIZING';
  }
  if (refreshInfo.status === 'IN_PROGRESS') {
    return refreshInfo.additionalStatus === 'LOGIN_IN_PROGRESS'
      ? 'IN_PROGRESS / VERIFYING_CREDENTIALS'
      : refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED'
        ? loginForm
          ? 'MFA / PENDING_USER_INPUT'
          : 'MFA / WAITING_FOR_LOGIN_FORM'
        : 'IN_PROGRESS / DOWNLOADING_DATA';
  }
  if (refreshInfo.status === 'FAILED') {
    const isMFAFailure =
      refreshInfo.statusMessage ===
      'MFA_INFO_NOT_PROVIDED_IN_REAL_TIME_BY_USER_VIA_APP';
    // NOTE: isLoginFailure is true during an MFA failure. Need to check
    // MFA failure first.
    const isLoginFailure = refreshInfo.additionalStatus === 'LOGIN_FAILED';
    return isMFAFailure
      ? 'FAILURE / MFA_FAILURE'
      : isLoginFailure
        ? 'FAILURE / BAD_CREDENTIALS'
        : 'FAILURE / INTERNAL_SERVICE_FAILURE';
  }
  return 'SUCCESS';
}

function getYodleeLoginForm(accountLink: AccountLink): YodleeLoginForm | null {
  invariant(
    accountLink.sourceOfTruth.type === 'YODLEE',
    'Expecting account link to come from YODLEE',
  );
  return accountLink.sourceOfTruth.loginForm || null;
}
