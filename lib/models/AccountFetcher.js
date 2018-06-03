'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var Immutable = _interopRequireWildcard(_immutable);

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

var _Model = require('./_Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class AccountFetcher extends _Model.ModelFetcher {

  genCollectionFromAccountLink(accountLinkID) {
    return this.__firebaseCollection.where('accountLinkRef.refID', '==', accountLinkID).get().then(snapshot => Immutable.Map(snapshot.docs.map(doc => {
      const account = _Account2.default.fromRaw(doc.data());
      return [account.id, account];
    })));
  }
}

AccountFetcher.collectionName = 'Accounts';
AccountFetcher.modelName = 'Account';
exports.default = new AccountFetcher();