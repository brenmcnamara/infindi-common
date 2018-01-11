'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genUpdateTransaction = exports.genCreateTransaction = exports.genFetchTransaction = undefined;

var _QueryBuilder = require('./_QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A bank transaction
 */
const genFetchTransaction = exports.genFetchTransaction = _QueryBuilder2.default.SingleDoc.fetch('Transactions');

const genCreateTransaction = exports.genCreateTransaction = _QueryBuilder2.default.SingleDoc.create('Transactions');

const genUpdateTransaction = exports.genUpdateTransaction = _QueryBuilder2.default.SingleDoc.update('Transactions');