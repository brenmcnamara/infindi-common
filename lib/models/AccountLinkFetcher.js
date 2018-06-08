'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AccountLink = require('./AccountLink');

var _AccountLink2 = _interopRequireDefault(_AccountLink);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Model = require('./_Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class AccountLinkFetcher extends _Model.ModelFetcher {

  genCollectionForUser(userID) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const snapshot = yield _this.__firebaseCollection.where('userRef.refID', '==', userID).get();
      return _immutable2.default.Map(snapshot.docs.map(function (doc) {
        const accountLink = _AccountLink2.default.fromRaw(doc.data());
        return [accountLink.id, accountLink];
      }));
    })();
  }

  genForUserAndProvider(userID, providerID) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const snapshot = yield _this2.__firebaseCollection.where('userRef.refID', '==', userID).where('providerRef.refID', '==', providerID).get();
      return snapshot.docs.length > 0 && snapshot.docs[0].exists ? snapshot.docs[0].data() : null;
    })();
  }
}

AccountLinkFetcher.collectionName = 'AccountLinks';
AccountLinkFetcher.modelName = 'AccountLink';
exports.default = new AccountLinkFetcher(_AccountLink2.default);