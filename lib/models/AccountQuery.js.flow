/* @flow */

import Account from './Account';

import type { ID } from '../../types/core';
import type { ModelQuery } from './Model';

export default class AccountQuery {
  static forAccountLink(accountLinkID: ID): ModelQuery {
    return Account.FirebaseCollectionUNSAFE.where(
      'accountLinkRef.refID',
      '==',
      accountLinkID,
    );
  }

  static forUser(userID: ID): ModelQuery {
    return Account.FirebaseCollectionUNSAFE.where(
      'userRef.refID',
      '==',
      userID,
    );
  }
}
