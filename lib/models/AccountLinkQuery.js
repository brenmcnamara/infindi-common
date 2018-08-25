'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AccountLink = require('./AccountLink');

var _AccountLink2 = _interopRequireDefault(_AccountLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AccountLinkQuery = {
  Collection: {
    forUser(userID) {
      const handle = _AccountLink2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID);
      return { handle, type: 'COLLECTION_QUERY' };
    }
  },

  OrderedCollection: {},

  Single: {
    forUserAndProvider(userID, providerID) {
      const handle = _AccountLink2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID).where('providerRef.refID', '==', providerID);
      return { handle, type: 'SINGLE_QUERY' };
    }
  }
};

exports.default = AccountLinkQuery;