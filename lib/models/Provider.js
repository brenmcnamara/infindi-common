'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getProviderCollection = getProviderCollection;
exports.getProviderName = getProviderName;
exports.createProvider = createProvider;
exports.genFetchProvider = genFetchProvider;
exports.genCreateProvider = genCreateProvider;
exports.genUpdateProvider = genUpdateProvider;
exports.genUpsertProvider = genUpsertProvider;
exports.genUpsertProviders = genUpsertProviders;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getProviderCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Providers');
}

function getProviderName(provider) {
  (0, _invariant2.default)(provider.sourceOfTruth.type === 'YODLEE', 'Expecting provider to come from YODLEE');
  return provider.sourceOfTruth.value.name;
}

function createProvider(sourceOfTruth, quirks) {
  return _extends({}, (0, _dbUtils.createModelStub)('Provider'), {
    id: getIDFromSourceOfTruth(sourceOfTruth),
    isDeprecated: false,
    quirkCount: quirks.length,
    quirks,
    sourceOfTruth
  });
}

function genFetchProvider(id) {
  return getProviderCollection().doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateProvider(provider) {
  return getProviderCollection().set(provider.id, provider);
}

function genUpdateProvider(provider) {
  return getProviderCollection().update(provider.id, provider);
}

function genUpsertProvider(provider) {
  return getProviderCollection().set(provider.id, provider);
}

const BATCH_LIMIT = 100;

function genUpsertProviders(providers) {
  return Promise.resolve().then(() => {
    const db = (0, _config.getFirebaseAdmin)().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    providers.forEach(p => {
      const ref = getProviderCollection().doc(p.id);
      currentBatch.set(ref, p);
      ++batchCount;
      if (batchCount > BATCH_LIMIT) {
        currentBatch = db.batch();
        batches.push(currentBatch);
      }
    });
    return Promise.all(batches.map(b => b.commit()));
  });
}

function getIDFromSourceOfTruth(sourceOfTruth) {
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        return String(sourceOfTruth.value.id);
      }

    default:
      (0, _invariant2.default)(false, 'Unrecognized sourceOfTruth: %s', sourceOfTruth.type);
  }
}