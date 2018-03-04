'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAccountLinkCollection = getAccountLinkCollection;
exports.createAccountLink = createAccountLink;
exports.createAccountLinkYodlee = createAccountLinkYodlee;
exports.updateAccountLink = updateAccountLink;
exports.updateAccountLinkYodlee = updateAccountLinkYodlee;
exports.genFetchAccountLink = genFetchAccountLink;
exports.genFetchAccountLinksForUser = genFetchAccountLinksForUser;
exports.genFetchAccountLinkForProvider = genFetchAccountLinkForProvider;
exports.genCreateAccountLink = genCreateAccountLink;
exports.genUpdateRefreshInfo = genUpdateRefreshInfo;
exports.genDeleteAccountLink = genDeleteAccountLink;
exports.isLinking = isLinking;
exports.isLinkSuccess = isLinkSuccess;
exports.isLinkFailure = isLinkFailure;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAccountLinkCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('AccountLinks');
}

function createAccountLink(sourceOfTruth, userID, providerID) {
  return _extends({}, (0, _dbUtils.createModelStub)('AccountLink'), {
    providerRef: (0, _dbUtils.createPointer)('Provider', providerID),
    sourceOfTruth,
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function createAccountLinkYodlee(yodleeProviderAccount, userID, providerID) {
  const sourceOfTruth = {
    providerAccount: yodleeProviderAccount,
    type: 'YODLEE'
  };
  return createAccountLink(sourceOfTruth, userID, providerID);
}

function updateAccountLink(accountLink, sourceOfTruth) {
  const now = new Date();
  return _extends({}, accountLink, {
    sourceOfTruth,
    updatedAt: now
  });
}

function updateAccountLinkYodlee(accountLink, yodleeProviderAccount) {
  const { sourceOfTruth } = accountLink;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting refresh info to come from YODLEE');
  const newSourceOfTruth = {
    providerAccount: yodleeProviderAccount,
    type: 'YODLEE'
  };
  return updateAccountLink(accountLink, newSourceOfTruth);
}

function genFetchAccountLink(id) {
  return getAccountLinkCollection().doc(id).get().then(doc => doc.exists ? doc.data() : null);
}

function genFetchAccountLinksForUser(userID) {
  return getAccountLinkCollection().where('userRef.refID', '==', userID).get().then(snapshot => {
    const accountLinks = [];
    snapshot.docs.forEach(doc => {
      if (doc.exists) {
        accountLinks.push(doc.data());
      }
    });
    return accountLinks;
  });
}

function genFetchAccountLinkForProvider(userID, providerID) {
  return getAccountLinkCollection().where('userRef.refID', '==', userID).where('providerRef.refID', '==', providerID).get().then(snapshot => {
    return snapshot.docs.length > 0 && snapshot.docs[0].exists ? snapshot.docs[0].data() : null;
  });
}

function genCreateAccountLink(accountLink) {
  return getAccountLinkCollection().doc(accountLink.id).set(accountLink);
}

function genUpdateRefreshInfo(accountLink) {
  return getAccountLinkCollection().doc(accountLink.id).update(accountLink);
}

function genDeleteAccountLink(id) {
  return getAccountLinkCollection().doc(id).delete();
}

function isLinking(accountLink) {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(!providerAccount || !providerAccount.refreshInfo.status || providerAccount.refreshInfo.status === 'IN_PROGRESS');
}

function isLinkSuccess(accountLink) {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(providerAccount && (providerAccount.refreshInfo.status === 'SUCCESS' || providerAccount.refreshInfo.status === 'PARTIAL_SUCCESS'));
}

function isLinkFailure(accountLink) {
  const providerAccount = getYodleeProviderAccount(accountLink);
  return Boolean(providerAccount && providerAccount.refreshInfo.status === 'FAILED');
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function getYodleeProviderAccount(accountLink) {
  const { sourceOfTruth } = accountLink;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting account link to come from YODLEE');
  return sourceOfTruth.providerAccount;
}