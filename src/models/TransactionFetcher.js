/* @flow */

import Transaction from './Transaction';

import { ModelFetcher } from './Model';

import type {
  TransactionCollection,
  TransactionOrderedCollection,
  TransactionRaw,
} from './Transaction';

class TransactionFetcher extends ModelFetcher<
  'Transaction',
  TransactionRaw,
  Transaction,
  TransactionCollection,
  TransactionOrderedCollection,
> {
  static collectionName = 'Transactions';
  static modelName = 'Transaction';
}

export default new TransactionFetcher(Transaction);
