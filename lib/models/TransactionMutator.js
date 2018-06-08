'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Transaction = require('./Transaction');

var _Transaction2 = _interopRequireDefault(_Transaction);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TransactionMutator extends _Model.ModelMutator {}

TransactionMutator.collectionName = 'Transactions';
TransactionMutator.modelName = 'Transaction';
exports.default = new TransactionMutator(_Transaction2.default);