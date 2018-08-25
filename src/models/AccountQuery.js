/* @flow */

import Account from './Account';

import type { ID } from '../../types/core';
import type { ModelCollectionQuery, ModelSingleQuery } from './Model';

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
  },

  OrderedCollection: {},

  Single: {
    forUser(userID: ID): ModelSingleQuery {
      const handle = Account.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      );
      return { handle, type: 'SINGLE_QUERY' };
    },
  },
};

export default AccountQuery;
