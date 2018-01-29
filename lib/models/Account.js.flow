/* @flow */

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
  +sourceOfTruth: AccountSourceOfTruth,
  +userRef: Pointer<'User'>,
};

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
        sourceOfTruth: { type: 'YODLEE', value: yodleeAccount },
      };
      return genUpdateAccount(updateAccount);
    });
}

export function getBalance(account: Account): Dollars {
  return 0;
}
