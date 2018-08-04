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
      return _AccountLink2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID);
    }
  },

  OrderedCollection: {},

  Single: {
    forUserAndProvider(userID, providerID) {
      return _AccountLink2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID).where('providerRef.refID', '==', providerID);
    }
  }
};

exports.default = AccountLinkQuery;