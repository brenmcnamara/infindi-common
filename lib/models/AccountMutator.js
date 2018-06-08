'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountMutator extends _Model.ModelMutator {}

AccountMutator.collectionName = 'Accounts';
AccountMutator.modelName = 'Account';
exports.default = new AccountMutator(_Account2.default);