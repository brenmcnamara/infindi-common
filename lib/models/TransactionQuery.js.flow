/* @flow */

import Transaction from './Transaction';

import type { ID } from '../../types/core';
import type { Long } from '../../types/yodlee-v1.0';
import type { ModelOrderedCollectionQuery, ModelSingleQuery } from './Model';

export const DEFAULT_TRANSACTION_LIMIT = 20;

const TransactionQuery = {
  Collection: {},

  OrderedCollection: {
    forAccount(
      accountID: ID,
      limit: number = DEFAULT_TRANSACTION_LIMIT,
    ): ModelOrderedCollectionQuery {
      let handle = Transaction.FirebaseCollectionUNSAFE.where(
        'accountRef.refID',
        '==',
        accountID,
      )
        .orderBy('transactionDate', 'desc')
        // NOTE: Sorting by id so that all results have a deterministic order.
        // Because transaction dates are rounded to the nearest day, there are
        // often ties when sorting by transaction date, which messes with paging.
        .orderBy('id');

      if (limit !== Infinity) {
        handle = handle.limit(limit);
      }

      return { handle, type: 'ORDERED_COLLECTION_QUERY' };
    },

    forAccountLink(
      accountLinkID: ID,
      limit: number = DEFAULT_TRANSACTION_LIMIT,
    ): ModelOrderedCollectionQuery {
      let handle = Transaction.FirebaseCollectionUNSAFE.where(
        'accountLinkRef.refID',
        '==',
        accountLinkID,
      )
        .orderBy('transactionDate', 'desc')
        .orderBy('id');
      if (limit !== Infinity) {
        handle = handle.limit(limit);
      }
      return { handle, type: 'ORDERED_COLLECTION_QUERY' };
    },

    forUser(
      userID: ID,
      limit: number = DEFAULT_TRANSACTION_LIMIT,
    ): ModelOrderedCollectionQuery {
      let handle = Transaction.FirebaseCollectionUNSAFE.where('userRef.refID')
        .orderBy('transactionDate', 'desc')
        .orderBy('id');
      if (limit !== Infinity) {
        handle = handle.limit(limit);
      }
      return { handle, type: 'ORDERED_COLLECTION_QUERY' };
    },
  },

  Single: {
    forYodleeTransaction(yodleeTransactionID: Long): ModelSingleQuery {
      const handle = Transaction.FirebaseCollectionUNSAFE.where(
        'sourceOfTruth.type',
        '==',
        'YODLEE',
      ).where('sourceOfTruth.value.id', '==', yodleeTransactionID);
      return { handle, type: 'SINGLE_QUERY' };
    },
  },
};

export default TransactionQuery;
