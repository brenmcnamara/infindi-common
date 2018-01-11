'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function singleDocFetch(collectionName) {
  return id => _config2.default.getFirebase().firestore().collection(collectionName).doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function singleDocCreate(collectionName) {
  return model => _config2.default.getFirebase().firestore().collection(collectionName).doc(model.id).set(model);
}

function singleDocUpdate(collectionName) {
  return model => {
    return _config2.default.getFirebase().firestore().collection(collectionName).doc(model.id).update(model);
  };
}

exports.default = {
  SingleDoc: {
    create: singleDocCreate,
    fetch: singleDocFetch,
    update: singleDocUpdate
  }
};