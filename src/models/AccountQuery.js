/* @flow */

import Account from './Account';

import type { ID } from '../../types/core';
import type { ModelQuery } from './Model';

export default class AccountQuery {
  forAccountLink(accountLinkID: ID): ModelQuery {
    return Account.FirebaseCollectionUNSAFE.where(
      'accountLinkRef.refID',
      '==',
      accountLinkID,
    );
  }

  forUser(userID: ID): ModelQuery {
    return Account.FirebaseCollectionUNSAFE.where(
      'userRef.refID',
      '==',
      userID,
    );
  }
}
