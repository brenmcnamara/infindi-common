/* @flow */

import AccountLink from './AccountLink';

import type { ID } from '../../types/core';
import type { ModelCollectionQuery, ModelSingleQuery } from './Model';

const AccountLinkQuery = {
  Collection: {
    forUser(userID: ID): ModelCollectionQuery {
      return AccountLink.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      );
    },
  },

  OrderedCollection: {},

  Single: {
    forUserAndProvider(userID: ID, providerID: ID): ModelSingleQuery {
      return AccountLink.FirebaseCollectionUNSAFE.where(
        'userRef.refID',
        '==',
        userID,
      )
        .where('providerRef.refID', '==', providerID);
    },
  },
};

export default AccountLinkQuery;
