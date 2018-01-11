/* @flow */

import QueryBuilder from './_QueryBuilder';

import type { Dollars, ID, ModelStub, Pointer } from '../../types/core';
import type { Transaction as PlaidTransaction } from '../../types/plaid';

/**
 * A bank transaction
 */
export type Transaction = ModelStub<'Transaction'> & {
  +accountRef: Pointer<'Account'>,
  +amount: Dollars,
  +category: ?string,
  +name: string,
  +sourceOfTruth: {|
    +type: 'PLAID',
    +value: PlaidTransaction,
  |},
  +transactionDate: Date,
  +userRef: Pointer<'User'>,
};

export const genFetchTransaction: ID => Promise<Transaction | null> = QueryBuilder.SingleDoc.fetch(
  'Transactions',
);

export const genCreateTransaction: Transaction => Promise<void,> = QueryBuilder.SingleDoc.create('Transactions');

export const genUpdateTransaction: Transaction => Promise<void,> = QueryBuilder.SingleDoc.update('Transactions');
