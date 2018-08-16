'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _YodleeCredentials = require('./YodleeCredentials');

var _YodleeCredentials2 = _interopRequireDefault(_YodleeCredentials);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class YodleeCredentialsFetcher extends _Model.ModelFetcher {}

YodleeCredentialsFetcher.collectionName = 'YodleeCredentials';
YodleeCredentialsFetcher.modelName = 'YodleeCredentials';
exports.default = new YodleeCredentialsFetcher(_YodleeCredentials2.default);