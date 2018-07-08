/* @flow */

import AccountLink from './AccountLink';

import type { ID } from '../../types/core';
import type { ModelQuery } from './Model';

export default class AccountLinkQuery {
  static forUser(userID: ID): ModelQuery {
    return AccountLink.FirebaseCollectionUNSAFE.where(
      'userRef.refID',
      '==',
      userID,
    );
  }
}
