'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AccountLink = require('./AccountLink');

var _AccountLink2 = _interopRequireDefault(_AccountLink);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountLinkMutator extends _Model.ModelMutator {}

AccountLinkMutator.collectionName = 'AccountLinks';
AccountLinkMutator.modelName = 'AccountLink';
exports.default = new AccountLinkMutator(_AccountLink2.default);