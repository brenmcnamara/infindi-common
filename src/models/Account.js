/* @flow */

import type { Account as PlaidAccount } from '../types/plaid';
import type { Dollars, ModelStub, Pointer } from '../types/core';

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
