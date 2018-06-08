'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Provider = require('./Provider');

var _Provider2 = _interopRequireDefault(_Provider);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProviderFetcher extends _Model.ModelFetcher {}

ProviderFetcher.collectionName = 'Providers';
ProviderFetcher.modelName = 'Provider';
exports.default = new ProviderFetcher(_Provider2.default);