/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { Account as PlaidAccount } from '../../types/plaid';
import type { Account as YodleeAccount } from '../../types/yodlee';
import type { Dollars, ID, ModelStub, Pointer } from '../../types/core';

export type AccountSourceOfTruth =
  | AccountSourceOfTruth$Yodlee
  | AccountSourceOfTruth$Plaid;

export type AccountSourceOfTruth$Yodlee = {|
  +type: 'YODLEE',
  +value: YodleeAccount,
|};

export type AccountSourceOfTruth$Plaid = {|
  +type: 'PLAID',
  +value: PlaidAccount,
|};

export type Account = ModelStub<'Account'> & {
  +shouldShowUser: bool,
  +sourceOfTruth: AccountSourceOfTruth,
  +userRef: Pointer<'User'>,
};

export type AccountGroupType =
  | 'AVAILABLE_CASH'
  | 'INVESTMENTS'
  | 'SHORT_TERM_DEBT'
  | 'OTHER';

export function getAccountsCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('Accounts');
}

export function createAccountFromYodleeAccount(
  yodleeAccount: YodleeAccount,
  userID: ID,
): Account {
  return {
    ...createModelStub('Account'),
    shouldShowUser: calculateShouldShowUser(yodleeAccount),
    sourceOfTruth: {
      type: 'YODLEE',
      value: yodleeAccount,
    },
    userRef: createPointer('User', userID),
  };
}

export function genFetchAccount(accountID: ID): Promise<Account | null> {
  return getAccountsCollection()
    .doc(accountID)
    .get()
    .then(doc => (doc.exists ? doc.data() : null));
}

export function genCreateAccount(account: Account): Promise<void> {
  return getAccountsCollection()
    .doc(account.id)
    .set(account);
}

export function genUpdateAccount(account: Account): Promise<void> {
  return getAccountsCollection()
    .doc(account.id)
    .update(account);
}

export function genUpsertAccountFromYodleeAccount(
  yodleeAccount: YodleeAccount,
  userID: ID,
): Promise<void> {
  return getAccountsCollection()
    .where('sourceOfTruth.type', '==', 'YODLEE')
    .where('sourceOfTruth.value.id', '==', yodleeAccount.id)
    .get()
    .then(snapshot => {
      const account =
        snapshot.docs.length > 0 && snapshot.docs[0].exists
          ? snapshot.docs[0].data()
          : null;
      if (!account) {
        // No account. Create a new one.
        const account = createAccountFromYodleeAccount(yodleeAccount, userID);
        return genCreateAccount(account);
      }
      // Update the existing account.
      const now = new Date();
      const updateAccount = {
        ...account,
        updatedAt: now,
        shouldShowUser: calculateShouldShowUser(yodleeAccount),
        sourceOfTruth: { type: 'YODLEE', value: yodleeAccount },
      };
      return genUpdateAccount(updateAccount);
    });
}

export function getAccountName(account: Account): string {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE': {
      const raw = sourceOfTruth.value.accountName;
      return raw
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    default:
      return invariant(
        false,
        'Unrecognized account sourceOfTruth.type %s',
        sourceOfTruth.type,
      );
  }
}

export function getBalance(account: Account): Dollars {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE': {
      const { balance } = sourceOfTruth.value;
      if (!balance) {
        return 0;
      }

      const groupType = getGroupType(account);
      return groupType === 'SHORT_TERM_DEBT' ? -balance.amount : balance.amount;
    }

    default: {
      return invariant(
        false,
        'Unrecognized account sourceOfTruth.type %s',
        sourceOfTruth.type,
      );
    }
  }
}

export function getAccountType(account: Account): string {
  const { sourceOfTruth } = account;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'getAccountType only works for YODLEE accounts',
  );
  return sourceOfTruth.value.accountType;
}

export function getGroupType(account: Account): AccountGroupType {
  const { sourceOfTruth } = account;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'getGroupType only works for YODLEE accounts',
  );
  const container = sourceOfTruth.value.CONTAINER;
  // const accountType = sourceOfTruth.value.accountType;

  switch (container) {
    case 'bank':
      return 'AVAILABLE_CASH';

    case 'investment':
      return 'INVESTMENTS';

    case 'creditCard':
      return 'SHORT_TERM_DEBT';
    default:
      return 'OTHER';
  }
}

export function getInstitution(account: Account): string {
  const { sourceOfTruth } = account;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'getInstitution only supports accounts of type YODLEE',
  );
  return sourceOfTruth.value.providerName.toUpperCase();
}

function calculateShouldShowUser(yodleeAccount: YodleeAccount): bool {
  return Boolean(
    yodleeAccount.accountType !== 'REWARD_POINTS' && yodleeAccount.balance,
  );
}
