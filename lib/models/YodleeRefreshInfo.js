'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createRefreshInfo = createRefreshInfo;
exports.genFetchRefreshInfo = genFetchRefreshInfo;
exports.genCreateRefreshInfo = genCreateRefreshInfo;
exports.isPending = isPending;
exports.isComplete = isComplete;
exports.didFail = didFail;

var _dbUtils = require('../db-utils');

var _config = require('../config');

function createRefreshInfo(raw, userID, providerID, providerAccountID) {
  return _extends({}, (0, _dbUtils.createModelStub)('YodleeRefreshInfo'), {
    providerAccountID,
    providerRef: {
      pointerType: 'YodleeProvider',
      refID: providerID,
      type: 'POINTER'
    },
    raw,
    userRef: {
      pointerType: 'User',
      refID: userID,
      type: 'POINTER'
    }
  });
}

function genFetchRefreshInfo(id) {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('YodleeRefreshInfo').doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateRefreshInfo(refreshInfo) {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('YodleeRefreshInfo').doc(refreshInfo.id).set(refreshInfo);
}

function isPending(refreshInfo) {
  return refreshInfo.raw.status === 'IN_PROGRESS';
}

function isComplete(refreshInfo) {
  return refreshInfo.raw.status === 'SUCCESS' || refreshInfo.raw.status === 'PARTIAL_SUCCESS';
}

function didFail(refreshInfo) {
  return refreshInfo.raw.status === 'FAILED';
}