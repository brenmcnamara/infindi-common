'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createProvider = createProvider;
exports.genFetchProvider = genFetchProvider;
exports.genCreateProvider = genCreateProvider;
exports.genUpdateProvider = genUpdateProvider;
exports.genUpsertProvider = genUpsertProvider;
exports.genUpsertProviders = genUpsertProviders;

var _dbUtils = require('../db-utils');

var _config = require('../config');

function createProvider(raw) {
  return _extends({}, (0, _dbUtils.createModelStub)('YodleeProvider'), {
    id: String(raw.id), // TODO: In the future, this will change to be type string.
    isDeprecated: false,
    raw
  });
}

function genFetchProvider(id) {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('YodleeProviders').doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateProvider(provider) {
  return (0, _config.getFirebaseAdmin)().collection('YodleeProviders').set(provider.id, provider);
}

function genUpdateProvider(provider) {
  return (0, _config.getFirebaseAdmin)().collection('YodleeProviders').update(provider.id, provider);
}

function genUpsertProvider(provider) {
  return (0, _config.getFirebaseAdmin)().collection('YodleeProviders').set(provider.id, provider);
}

const BATCH_LIMIT = 100;

function genUpsertProviders(providers) {
  return Promise.resolve().then(() => {
    const db = (0, _config.getFirebaseAdmin)().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    providers.forEach(p => {
      const ref = db.collection('YodleeProviders').doc(p.id);
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