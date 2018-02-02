'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getYodleeRefreshInfoCollection = getYodleeRefreshInfoCollection;
exports.createRefreshInfo = createRefreshInfo;
exports.updateRefreshInfo = updateRefreshInfo;
exports.genFetchRefreshInfo = genFetchRefreshInfo;
exports.genFetchRefreshInfoForUser = genFetchRefreshInfoForUser;
exports.genFetchRefreshInfoForProvider = genFetchRefreshInfoForProvider;
exports.genCreateRefreshInfo = genCreateRefreshInfo;
exports.genUpdateRefreshInfo = genUpdateRefreshInfo;
exports.isPending = isPending;
exports.isComplete = isComplete;
exports.didFail = didFail;

var _dbUtils = require('../db-utils');

var _config = require('../config');

function getYodleeRefreshInfoCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('YodleeRefreshInfo');
}

function createRefreshInfo(raw, userID, providerID, providerAccountID) {
  return _extends({}, (0, _dbUtils.createModelStub)('YodleeRefreshInfo'), {
    providerAccountID,
    providerRef: (0, _dbUtils.createPointer)('YodleeProvider', providerID),
    raw,
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function updateRefreshInfo(refreshInfo, raw) {
  const now = new Date();
  return _extends({}, refreshInfo, {
    raw,
    updatedAt: now
  });
}

function genFetchRefreshInfo(id) {
  return getYodleeRefreshInfoCollection().doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genFetchRefreshInfoForUser(userID) {
  return getYodleeRefreshInfoCollection().where('userRef.refID', '==', userID).get().then(snapshot => {
    const refreshInfo = [];
    snapshot.docs.forEach(doc => {
      if (doc.exists) {
        refreshInfo.push(doc.data());
      }
    });
    return refreshInfo;
  });
}

function genFetchRefreshInfoForProvider(userID, providerID) {
  return getYodleeRefreshInfoCollection().where('userRef.refID', '==', userID).where('providerRef.refID', '==', providerID).get().then(snapshot => {
    return snapshot.docs.length > 0 && snapshot.docs[0].exists ? snapshot.docs[0].data() : null;
  });
}

function genCreateRefreshInfo(refreshInfo) {
  return getYodleeRefreshInfoCollection().doc(refreshInfo.id).set(refreshInfo);
}

function genUpdateRefreshInfo(refreshInfo) {
  return getYodleeRefreshInfoCollection().doc(refreshInfo.id).update(refreshInfo);
}

function isPending(refreshInfo) {
  return !refreshInfo.raw.status || refreshInfo.raw.status === 'IN_PROGRESS';
}

function isComplete(refreshInfo) {
  return refreshInfo.raw.status === 'SUCCESS' || refreshInfo.raw.status === 'PARTIAL_SUCCESS';
}

function didFail(refreshInfo) {
  return refreshInfo.raw.status === 'FAILED';
}