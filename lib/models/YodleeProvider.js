'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createProvider = createProvider;
exports.genFetchProvider = genFetchProvider;
exports.genCreateProvider = genCreateProvider;
exports.genUpdateProvider = genUpdateProvider;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _dbUtils = require('../db-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createProvider(raw) {
  return _extends({}, (0, _dbUtils.createModelStub)('YodleeProvider'), {
    id: String(raw.id), // TODO: In the future, this will change to be type string.
    isDeprecated: false,
    raw
  });
}

function genFetchProvider(id) {
  return _config2.default.getFirebaseAdminOrClient().firestore().collection('YodleeProviders').doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateProvider(provider) {
  return _config2.default.getFirebaseAdmin().collection('YodleeProviders').set(provider.id, provider);
}

function genUpdateProvider(provider) {
  return _config2.default.getFirebaseAdmin().collection('YodleeProviders').update(provider.id, provider);
}