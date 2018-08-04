'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_TRANSACTION_LIMIT = undefined;

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_TRANSACTION_LIMIT = exports.DEFAULT_TRANSACTION_LIMIT = 20;

const TransactionQuery = {
  Collection: {},

  OrderedCollection: {
    forAccount(accountID, limit = DEFAULT_TRANSACTION_LIMIT) {
      let query = _Transaction2.default.FirebaseCollectionUNSAFE.where('accountRef.refID', '==', accountID).orderBy('transactionDate', 'desc')
      // NOTE: Sorting by id so that all results have a deterministic order.
      // Because transaction dates are rounded to the nearest day, there are
      // often ties when sorting by transaction date, which messes with paging.
      .orderBy('id');

      if (query) {
        query = query.limit(limit);
      }

      return query;
    },

    forAccountLink(accountLinkID, limit = DEFAULT_TRANSACTION_LIMIT) {
      let query = _Transaction2.default.FirebaseCollectionUNSAFE.where('accountLinkRef.refID', '==', accountLinkID).orderBy('transactionDate', 'desc').orderBy('id');
      if (limit !== Infinity) {
        query = query.limit(limit);
      }
      return query;
    },

    forUser(userID, limit = DEFAULT_TRANSACTION_LIMIT) {
      let query = _Transaction2.default.FirebaseCollectionUNSAFE.where('userRef.refID').orderBy('transactionDate', 'desc').orderBy('id');
      if (limit !== Infinity) {
        query = query.limit(limit);
      }
      return query;
    }
  },

  Single: {
    forYodleeTransaction(yodleeTransactionID) {
      return _Transaction2.default.FirebaseCollectionUNSAFE.where('sourceOfTruth.type', '==', 'YODLEE').where('sourceOfTruth.value.id', '==', yodleeTransactionID);
    }
  }
};

exports.default = TransactionQuery;