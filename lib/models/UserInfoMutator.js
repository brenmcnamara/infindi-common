'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _UserInfo = require('./UserInfo');

var _UserInfo2 = _interopRequireDefault(_UserInfo);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserInfoMutator extends _Model.ModelMutator {}

UserInfoMutator.collectionName = 'UserInfo';
UserInfoMutator.modelName = 'UserInfo';
exports.default = new UserInfoMutator(_UserInfo2.default);