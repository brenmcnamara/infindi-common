'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genUpdateAccount = exports.genCreateAccount = exports.genFetchAccount = undefined;

var _QueryBuilder = require('./_QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Represents the bank account of a user.
 */
const genFetchAccount = exports.genFetchAccount = _QueryBuilder2.default.SingleDoc.fetch('Accounts');

const genCreateAccount = exports.genCreateAccount = _QueryBuilder2.default.SingleDoc.create('Accounts');

const genUpdateAccount = exports.genUpdateAccount = _QueryBuilder2.default.SingleDoc.update('Accounts');