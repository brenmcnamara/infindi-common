'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class TransactionFetcher extends _Model.ModelFetcher {

  genOrderedCollectionForUser(userID, limit = 20) {
    var _this = this;

    return _asyncToGenerator(function* () {
      let query = _this.__firebaseCollection.where('userRef.refID').orderBy('transactionDate', 'desc').orderBy('id');
      if (limit !== Infinity) {
        query = query.limit(limit);
      }
      const snapshot = yield query.get();

      return _immutable2.default.OrderedMap(snapshot.docs.map(function (doc) {
        const transaction = _Transaction2.default.fromRaw(doc.data());
        return [transaction.id, transaction];
      }));
    })();
  }

  genOrderedCollectionForAccountLink(accountLinkID, limit = 20) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let query = _this2.__firebaseCollection.where('accountLinkRef.refID', '==', accountLinkID).orderBy('transactionDate', 'desc').orderBy('id');
      if (limit !== Infinity) {
        query = query.limit(limit);
      }
      const snapshot = yield query.get();

      return _immutable2.default.OrderedMap(snapshot.docs.map(function (doc) {
        const transaction = _Transaction2.default.fromRaw(doc.data());
        return [transaction.id, transaction];
      }));
    })();
  }

  genOrderedCollectionForAccount(accountID, limit = 20) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let query = _this3.__firebaseCollection.where('accountRef.refID', '==', accountID)
      // Transaction dates are rounded to the day, so we sort by createdDate as
      // well as a fallback.
      .orderBy('transactionDate', 'desc').orderBy('id');
      if (limit !== Infinity) {
        query = query.limit(limit);
      }
      const snapshot = yield query.get();

      return _immutable2.default.OrderedMap(snapshot.docs.map(function (doc) {
        const transaction = _Transaction2.default.fromRaw(doc.data());
        return [transaction.id, transaction];
      }));
    })();
  }

  genForYodleeTransaction(yodleeTransaction) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const snapshot = yield _this4.__firebaseCollection.where('sourceOfTruth.type', '==', 'YODLEE').where('sourceOfTruth.value.id', '==', yodleeTransaction.id).get();
      return snapshot.docs[0] && snapshot.docs[0].exists ? _Transaction2.default.fromRaw(snapshot.docs[0].data()) : null;
    })();
  }
}

TransactionFetcher.collectionName = 'Transactions';
TransactionFetcher.modelName = 'Transaction';
exports.default = new TransactionFetcher(_Transaction2.default);