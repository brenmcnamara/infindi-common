'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./_Model');

class UserInfoFetcher extends _Model.ModelFetcher {}

UserInfoFetcher.collectionName = 'UserInfo';
UserInfoFetcher.modelName = 'UserInfo';
exports.default = new UserInfoFetcher();