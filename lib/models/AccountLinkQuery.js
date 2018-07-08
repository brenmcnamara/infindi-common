'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AccountLink = require('./AccountLink');

var _AccountLink2 = _interopRequireDefault(_AccountLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountLinkQuery {
  static forUser(userID) {
    return _AccountLink2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID);
  }
}
exports.default = AccountLinkQuery;