/* @flow */

import type { Dollars, ModelStub, Pointer } from '../types/core';
import type { Transaction as PlaidTransaction } from '../types/plaid';

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
