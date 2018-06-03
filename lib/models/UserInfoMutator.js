'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./_Model');

class UserInfoMutator extends _Model.ModelMutator {}

UserInfoMutator.collectionName = 'UserInfo';
UserInfoMutator.modelName = 'UserInfo';
exports.default = new UserInfoMutator();