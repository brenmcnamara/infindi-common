'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AccountLink = require('./AccountLink');

var _AccountLink2 = _interopRequireDefault(_AccountLink);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AccountLinkFetcher extends _Model.ModelFetcher {}

AccountLinkFetcher.collectionName = 'AccountLinks';
AccountLinkFetcher.modelName = 'AccountLink';
exports.default = new AccountLinkFetcher(_AccountLink2.default);