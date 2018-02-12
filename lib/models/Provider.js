'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getProvidersCollection = getProvidersCollection;
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

function getProvidersCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Providers');
}

function createProvider(sourceOfTruth) {
  return _extends({}, (0, _dbUtils.createModelStub)('Provider'), {
    id: getIDFromSourceOfTruth(sourceOfTruth),
    isDeprecated: false,
    sourceOfTruth
  });
}

function genFetchProvider(id) {
  return getProvidersCollection().doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateProvider(provider) {
  return getProvidersCollection().set(provider.id, provider);
}

function genUpdateProvider(provider) {
  return getProvidersCollection().update(provider.id, provider);
}

function genUpsertProvider(provider) {
  return getProvidersCollection().set(provider.id, provider);
}

const BATCH_LIMIT = 100;

function genUpsertProviders(providers) {
  return Promise.resolve().then(() => {
    const db = (0, _config.getFirebaseAdmin)().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    providers.forEach(p => {
      const ref = getProvidersCollection().doc(p.id);
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