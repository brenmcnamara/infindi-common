'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UserInfo = require('./UserInfo');

var _UserInfo2 = _interopRequireDefault(_UserInfo);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserInfoFetcher extends _Model.ModelFetcher {}

UserInfoFetcher.collectionName = 'UserInfo';
UserInfoFetcher.modelName = 'UserInfo';
exports.default = new UserInfoFetcher(_UserInfo2.default);