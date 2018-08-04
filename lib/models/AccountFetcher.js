'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountFetcher extends _Model.ModelFetcher {}

AccountFetcher.collectionName = 'Accounts';
AccountFetcher.modelName = 'Account';
exports.default = new AccountFetcher(_Account2.default);