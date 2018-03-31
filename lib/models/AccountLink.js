'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAccountLinkCollection = getAccountLinkCollection;
exports.createAccountLink = createAccountLink;
exports.createAccountLinkYodlee = createAccountLinkYodlee;
exports.updateAccountLink = updateAccountLink;
exports.updateAccountLinkStatus = updateAccountLinkStatus;
exports.updateAccountLinkYodlee = updateAccountLinkYodlee;
exports.genFetchAccountLink = genFetchAccountLink;
exports.genFetchAccountLinksForUser = genFetchAccountLinksForUser;
exports.genFetchAccountLinkForProvider = genFetchAccountLinkForProvider;
exports.genCreateAccountLink = genCreateAccountLink;
exports.genUpdateRefreshInfo = genUpdateRefreshInfo;
exports.genDeleteAccountLink = genDeleteAccountLink;
exports.isLinking = isLinking;
exports.isPendingUserInput = isPendingUserInput;
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
    status: calculateAccountLinkStatus(sourceOfTruth),
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function createAccountLinkYodlee(yodleeProviderAccount, userID, providerID) {
  const sourceOfTruth = {
    loginForm: yodleeProviderAccount.additionalStatus === 'USER_INPUT_REQUIRED' ? yodleeProviderAccount.loginForm || null : null,
    providerAccount: yodleeProviderAccount,
    type: 'YODLEE'
  };
  return createAccountLink(sourceOfTruth, userID, providerID);
}

function updateAccountLink(accountLink, sourceOfTruth) {
  const now = new Date();
  const newAccountLink = _extends({}, accountLink, {
    sourceOfTruth,
    status: calculateAccountLinkStatus(sourceOfTruth),
    updatedAt: now
  });
  return newAccountLink;
}

function updateAccountLinkStatus(accountLink, status) {
  const now = new Date();
  const newAccountLink = _extends({}, accountLink, {
    status,
    updatedAt: now
  });
  return newAccountLink;
}

function updateAccountLinkYodlee(accountLink, yodleeProviderAccount) {
  const { sourceOfTruth } = accountLink;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting refresh info to come from YODLEE');
  const loginForm = yodleeProviderAccount.refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED' ? yodleeProviderAccount.loginForm || getYodleeLoginForm(accountLink) : null;
  const newSourceOfTruth = {
    loginForm,
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
  return accountLink.status.startsWith('IN_PROGRESS');
}

function isPendingUserInput(accountLink) {
  return accountLink.status === 'MFA / PENDING_USER_INPUT';
}

function isLinkSuccess(accountLink) {
  return accountLink.status.startsWith('SUCCESS');
}

function isLinkFailure(accountLink) {
  return accountLink.status.startsWith('FAILURE');
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function calculateAccountLinkStatus(sourceOfTruth) {
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Calculating account link status only supports yodlee');
  const { loginForm, refreshInfo } = sourceOfTruth.providerAccount;

  if (!refreshInfo.status) {
    return 'IN_PROGRESS / INITIALIZING';
  }
  if (refreshInfo.status === 'IN_PROGRESS') {
    return refreshInfo.additionalStatus === 'LOGIN_IN_PROGRESS' ? 'IN_PROGRESS / VERIFYING_CREDENTIALS' : refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED' ? loginForm ? 'MFA / PENDING_USER_INPUT' : 'MFA / WAITING_FOR_LOGIN_FORM' : 'IN_PROGRESS / DOWNLOADING_DATA';
  }
  if (refreshInfo.status === 'FAILED') {
    const isMFAFailure = refreshInfo.statusMessage === 'MFA_INFO_NOT_PROVIDED_IN_REAL_TIME_BY_USER_VIA_APP';
    // NOTE: isLoginFailure is true during an MFA failure. Need to check
    // MFA failure first.
    const isLoginFailure = refreshInfo.additionalStatus === 'LOGIN_FAILED';
    return isMFAFailure ? 'FAILURE / MFA_FAILURE' : isLoginFailure ? 'FAILURE / BAD_CREDENTIALS' : 'FAILURE / INTERNAL_SERVICE_FAILURE';
  }
  return 'SUCCESS';
}

function getYodleeLoginForm(accountLink) {
  (0, _invariant2.default)(accountLink.sourceOfTruth.type === 'YODLEE', 'Expecting account link to come from YODLEE');
  return accountLink.sourceOfTruth.loginForm || null;
}