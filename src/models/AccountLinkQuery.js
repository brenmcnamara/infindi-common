/* @flow */

import AccountLink from './AccountLink';

import type { ID } from '../../types/core';
import type { ModelCollectionQuery, ModelSingleQuery } from './Model';

const AccountLinkQuery = {
  Collection: {
    forUser(userID: ID): ModelCollectionQuery {
      const handle = AccountLink.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      );
      return { handle, type: 'COLLECTION_QUERY' };
    },
  },

  OrderedCollection: {},

  Single: {
    forUserAndProvider(userID: ID, providerID: ID): ModelSingleQuery {
      const handle = AccountLink.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      ).where('providerRef.refID', '==', providerID);
      return { handle, type: 'SINGLE_QUERY' };
    },
  },
};

export default AccountLinkQuery;
