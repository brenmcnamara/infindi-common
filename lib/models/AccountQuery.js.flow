/* @flow */

import Account from './Account';

import type { ID } from '../../types/core';
import type { ModelCollectionQuery } from './Model';

const AccountQuery = {
  Collection: {
    forAccountLink(accountLinkID: ID): ModelCollectionQuery {
      const handle = Account.FirebaseCollectionUNSAFE.where(
        'accountLinkRef.refID',
        '==',
        accountLinkID,
      );
      return { handle, type: 'COLLECTION_QUERY' };
    },

    forUser(userID: ID): ModelCollectionQuery {
      const handle = Account.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      );
      return { handle, type: 'COLLECTION_QUERY' };
    },
  },

  OrderedCollection: {},

  Single: {},
};

export default AccountQuery;
