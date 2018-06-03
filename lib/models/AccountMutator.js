'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./_Model');

class AccountMutator extends _Model.ModelMutator {}

AccountMutator.collectionName = 'Accounts';
AccountMutator.modelName = 'Account';
exports.default = new AccountMutator();