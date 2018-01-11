/* @flow */

import QueryBuilder from './_QueryBuilder';

import type { Account as PlaidAccount } from '../../types/plaid';
import type { Dollars, ID, ModelStub, Pointer } from '../../types/core';

/**
 * Represents the bank account of a user.
 */
export type Account = ModelStub<'Account'> & {
  +alias: ?number,
  +balance: Dollars,
  +credentialsRef: Pointer<'PlaidCredentials'>,
  +institutionName: string,
  +name: string,
  +sourceOfTruth: {|
    +type: 'PLAID',
    +value: PlaidAccount,
  |},
  +userRef: Pointer<'User'>,
};

export const genFetchAccount: ID => Promise<Account | null> = QueryBuilder.SingleDoc.fetch(
  'Accounts',
);

export const genCreateAccount: Account => Promise<void,> = QueryBuilder.SingleDoc.create('Accounts');

export const genUpdateAccount: Account => Promise<void,> = QueryBuilder.SingleDoc.update('Accounts');
