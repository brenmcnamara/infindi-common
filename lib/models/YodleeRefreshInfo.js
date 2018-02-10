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
exports.getProviderID = getProviderID;
exports.isPendingStatus = isPendingStatus;
exports.isInProgress = isInProgress;
exports.isComplete = isComplete;
exports.didFail = didFail;
exports.includesAccount = includesAccount;
exports.createRefreshSchedule = createRefreshSchedule;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MILLIS_PER_SECOND = 1000;
const MILLIS_PER_DAY = 1000 * 60 * 60 * 24;

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

function getProviderID(refreshInfo) {
  return refreshInfo.providerRef.refID;
}

function isPendingStatus(refreshInfo) {
  return !refreshInfo.raw.status;
}

function isInProgress(refreshInfo) {
  return refreshInfo.raw.status === 'IN_PROGRESS';
}

function isComplete(refreshInfo) {
  return refreshInfo.raw.status === 'SUCCESS' || refreshInfo.raw.status === 'PARTIAL_SUCCESS';
}

function didFail(refreshInfo) {
  return refreshInfo.raw.status === 'FAILED';
}

function includesAccount(refreshInfo, account) {
  const { sourceOfTruth } = account;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'includesAccounts only works for YODLEE accounts');
  return sourceOfTruth.value.providerId === refreshInfo.providerRef.refID;
}

function createRefreshSchedule(refreshInfo) {
  if (isPendingStatus(refreshInfo)) {
    return {
      recurringType: 'ONCE',
      runAt: new Date(Date.now() + MILLIS_PER_SECOND * 5)
    };
  } else if (isInProgress(refreshInfo)) {
    return {
      recurringType: 'ONCE',
      runAt: new Date(Date.now() + MILLIS_PER_SECOND * 30)
    };
  } else if (refreshInfo.raw.nextRefreshScheduled) {
    const runAt = new Date(Date.parse(refreshInfo.raw.nextRefreshScheduled));
    return {
      recurringType: 'ONCE',
      runAt
    };
  }
  return {
    recurringType: 'ONCE',
    runAt: new Date(Date.now() + MILLIS_PER_DAY * 1.0)
  };
}