'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionFetcher extends _Model.ModelFetcher {}

TransactionFetcher.collectionName = 'Transactions';
TransactionFetcher.modelName = 'Transaction';
exports.default = new TransactionFetcher(_Transaction2.default);