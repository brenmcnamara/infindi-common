/* @flow */

import Account from './Account';

import { ModelMutator } from './_Model';

import type { AccountRaw } from './Account';

class AccountMutator extends ModelMutator<'Account', AccountRaw, Account> {
  static collectionName = 'Accounts';
  static modelName = 'Account';
}

export default new AccountMutator(Account);
