/* @flow */

import Transaction from './Transaction';

import type { ID } from '../../types/core';
import type { ModelOrderedQuery } from './Model';

export default class TransactionQuery {
  orderedForAccount(accountID: ID): ModelOrderedQuery {
    return (
      Transaction.FirebaseCollectionUNSAFE.where(
        'accountRef.refID',
        '==',
        accountID,
      )
        .orderBy('transactionDate', 'desc')
        // NOTE: Sorting by id so that all results have a deterministic order.
        // Because transaction dates are rounded to the nearest day, there are
        // often ties when sorting by transaction date, which messes with paging.
        .orderBy('id')
    );
  }
}
