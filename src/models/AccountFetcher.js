/* @flow */

import * as Immutable from 'immutable';
import Account from './Account';

import { ModelFetcher } from './Model';

import type {
  AccountCollection,
  AccountOrderedCollection,
  AccountRaw,
} from './Account';
import type { ID } from '../../types/core';

class AccountFetcher extends ModelFetcher<
  'Account',
  AccountRaw,
  Account,
  AccountCollection,
  AccountOrderedCollection,
> {
  static collectionName = 'Accounts';
  static modelName = 'Account';

  // TODO: From -> For
  genCollectionFromAccountLink(accountLinkID: ID): Promise<AccountCollection> {
    return this.__firebaseCollection
      .where('accountLinkRef.refID', '==', accountLinkID)
      .get()
      .then(snapshot =>
        Immutable.Map(
          snapshot.docs.map(doc => {
            const account = Account.fromRaw(doc.data());
            return [account.id, account];
          }),
        ),
      );
  }
}

export default new AccountFetcher(Account);
