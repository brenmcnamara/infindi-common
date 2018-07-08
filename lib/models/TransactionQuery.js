'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionQuery {
  orderedForAccount(accountID) {
    return _Transaction2.default.FirebaseCollectionUNSAFE.where('accountRef.refID', '==', accountID).orderBy('transactionDate', 'desc')
    // NOTE: Sorting by id so that all results have a deterministic order.
    // Because transaction dates are rounded to the nearest day, there are
    // often ties when sorting by transaction date, which messes with paging.
    .orderBy('id');
  }
}
exports.default = TransactionQuery;