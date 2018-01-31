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

export type AccountGroupType = 'AVAILABLE_CASH' | 'SHORT_TERM_DEBT' | 'OTHER';

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
      return sourceOfTruth.value.accountName;
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
      return balance ? balance.amount : 0;
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

export function getGroupType(account: Account): AccountGroupType {
  return 'AVAILABLE_CASH';
}

export function getInstitution(account: Account): string {
  return 'CHASE';
}

function calculateShouldShowUser(yodleeAccount: YodleeAccount): bool {
  return Boolean(
    yodleeAccount.accountType !== 'REWARD_POINTS' && yodleeAccount.balance,
  );
}
