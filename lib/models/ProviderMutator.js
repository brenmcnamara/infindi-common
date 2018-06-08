'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _Model = require('./_Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderMutator extends _Model.ModelMutator {}

ProviderMutator.collectionName = 'Providers';
ProviderMutator.modelName = 'Provider';
exports.default = new ProviderMutator(_Provider2.default);