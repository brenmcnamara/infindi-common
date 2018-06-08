/* @flow */

import Immutable from 'immutable';
import Transaction from './Transaction';

import { ModelFetcher } from './Model';

import type { ID } from '../../types/core';
import type { Transaction as YodleeTransaction } from '../../types/yodlee-v1.0';
import type { TransactionOrderedCollection, TransactionRaw } from './Transaction';

class TransactionFetcher extends ModelFetcher<
  'Transaction',
  TransactionRaw,
  Transaction,
> {
  static collectionName = 'Transactions';
  static modelName = 'Transaction';

  async genOrderedCollectionForAccount(
    accountID: ID,
    limit: number = 20,
  ): Promise<TransactionOrderedCollection> {
    let query = this.__firebaseCollection
      .where('accountRef.refID', '==', accountID)
      // Transaction dates are rounded to the day, so we sort by createdDate as
      // well as a fallback.
      .orderBy('transactionDate', 'desc');
    if (limit !== Infinity) {
      query = query.limit(limit);
    }
    const snapshot = await query.get();

    return Immutable.OrderedMap(
      snapshot.docs.map(doc => {
        const accountLink = Transaction.fromRaw(doc.data());
        return [accountLink.id, accountLink];
      }),
    );
  }

  async genForYodleeTransaction(
    yodleeTransaction: YodleeTransaction,
  ): Promise<Transaction | null> {
    const snapshot = await this.__firebaseCollection
      .where('sourceOfTruth.type', '==', 'YODLEE')
      .where('sourceOfTruth.value.id', '==', yodleeTransaction.id)
      .get();
    return snapshot.docs[0] && snapshot.docs[0].exists
      ? Transaction.fromRaw(snapshot.docs[0].data())
      : null;
  }
}

export default new TransactionFetcher(Transaction);
