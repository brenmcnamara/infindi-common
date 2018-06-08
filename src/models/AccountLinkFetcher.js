/* @flow */

import AccountLink from './AccountLink';
import Immutable from 'immutable';

import { ModelFetcher } from './Model';

import type { AccountLinkCollection, AccountLinkRaw } from './AccountLink';
import type { ID } from '../../types/core';

class AccountLinkFetcher extends ModelFetcher<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
> {
  static collectionName = 'AccountLinks';
  static modelName = 'AccountLink';

  async genCollectionForUser(userID: ID): Promise<AccountLinkCollection> {
    const snapshot = await this.__firebaseCollection
      .where('userRef.refID', '==', userID)
      .get();
    return Immutable.Map(
      snapshot.docs.map(doc => {
        const accountLink = AccountLink.fromRaw(doc.data());
        return [accountLink.id, accountLink];
      }),
    );
  }

  async genForUserAndProvider(
    userID: ID,
    providerID: ID,
  ): Promise<AccountLink | null> {
    const snapshot = await this.__firebaseCollection
      .where('userRef.refID', '==', userID)
      .where('providerRef.refID', '==', providerID)
      .get();
    return snapshot.docs.length > 0 && snapshot.docs[0].exists
      ? snapshot.docs[0].data()
      : null;
  }
}

export default new AccountLinkFetcher(AccountLink);
