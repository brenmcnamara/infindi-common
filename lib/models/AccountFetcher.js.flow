/* @flow */

import Account from './Account';

import { ModelFetcher } from './Model';

import type {
  AccountCollection,
  AccountOrderedCollection,
  AccountRaw,
} from './Account';

class AccountFetcher extends ModelFetcher<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
  AccountOrderedCollection,
> {
  static collectionName = 'Accounts';
  static modelName = 'Account';
}

export default new AccountFetcher(Account);
