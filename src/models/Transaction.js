/* @flow */

import { createModelStub, createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { Account } from './Account';
import type { ID, ModelStub, Pointer } from '../../types/core';
import type { Transaction as YodleeTransaction } from '../../types/yodlee';

/**
 * A bank transaction
 */
export type Transaction = ModelStub<'Transaction'> & {
  +accountRef: Pointer<'Account'>,
  +sourceOfTruth: {|
    +type: 'YODLEE',
    +value: YodleeTransaction,
  |},
  +transactionDate: Date,
  +userRef: Pointer<'User'>,
};

export function getTransactionCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('Transactions');
}

export function createTransactionYodlee(
  yodleeTransaction: YodleeTransaction,
  userID: ID,
  accountID: ID,
): Transaction {
  const dateComponents = yodleeTransaction.postDate
    .split('-')
    .map(c => parseInt(c, 10));
  const transactionDate = new Date(
    Date.UTC(dateComponents[0], dateComponents[1] - 1, dateComponents[2]),
  );

  return {
    accountRef: createPointer('Account', accountID),
    ...createModelStub('Transaction'),
    sourceOfTruth: {
      type: 'YODLEE',
      value: yodleeTransaction,
    },
    transactionDate,
    userRef: createPointer('User', userID),
  };
}

export async function genFetchTransactionsForAccount(
  account: Account,
  limit: number = 20,
): Promise<Array<Transaction>> {
  let query = getTransactionCollection()
    .where('accountRef.refID', '==', account.id)
    // Transaction dates are rounded to the day, so we sort by createdDate as
    // well as a fallback.
    .orderBy('transactionDate', 'desc')
    .orderBy('sourceOfTruth.value.createdDate', 'desc');
  if (limit !== Infinity) {
    query = query.limit(limit);
  }
  const snapshot = await query.get();

  return snapshot.docs.filter(doc => doc.exists).map(doc => doc.data());
}

export async function genDoesYodleeTransactionExist(
  yodleeTransaction: YodleeTransaction,
): Promise<bool> {
  const doc = await getTransactionCollection()
    .where('sourceOfTruth.type', '==', 'YODLEE')
    .where('sourceOfTruth.value.id', '==', yodleeTransaction.id);
  return Boolean(doc && doc.exists);
}

export function genCreateTransaction(transaction: Transaction): Promise<void> {
  return getTransactionCollection()
    .doc(transaction.id)
    .set(transaction);
}
