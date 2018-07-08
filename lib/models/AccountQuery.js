'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountQuery {
  forAccountLink(accountLinkID) {
    return _Account2.default.FirebaseCollectionUNSAFE.where('accountLinkRef.refID', '==', accountLinkID);
  }

  forUser(userID) {
    return _Account2.default.FirebaseCollectionUNSAFE.where('userRef.refID', '==', userID);
  }
}
exports.default = AccountQuery;