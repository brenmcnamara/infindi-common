/* @flow */

import Account from './Account';

import type { ID } from '../../types/core';
import type { ModelCollectionQuery } from './Model';

const AccountQuery = {
  Collection: {
    forAccountLink(accountLinkID: ID): ModelCollectionQuery {
      return Account.FirebaseCollectionUNSAFE.where(
        'accountLinkRef.refID',
        '==',
        accountLinkID,
      );
    },
  },

  OrderedCollection: {},

  Single: {
    forUser(userID: ID): ModelCollectionQuery {
      return Account.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      );
    },
  },
};

export default AccountQuery;
