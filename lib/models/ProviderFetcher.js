'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./_Model');

class ProviderFetcher extends _Model.ModelFetcher {}

ProviderFetcher.collectionName = 'Providers';
ProviderFetcher.modelName = 'Provider';
exports.default = new ProviderFetcher();