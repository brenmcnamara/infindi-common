'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./_Model');

class ProviderMutator extends _Model.ModelMutator {}

ProviderMutator.collectionName = 'Providers';
ProviderMutator.modelName = 'Provider';
exports.default = new ProviderMutator();