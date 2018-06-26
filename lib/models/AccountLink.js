'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

/**
 * Source of truth will be empty before the account is linked with anything.
 * The account link needs to be created before we can link it to a source.
 */
class AccountLink extends _Model.Model {
  // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static create(sourceOfTruth, userID, providerID, providerName) {
    return this.fromRaw(_extends({}, (0, _dbUtils.createModelStub)('AccountLink'), {
      providerName,
      providerRef: (0, _dbUtils.createPointer)('Provider', providerID),
      sourceOfTruth,
      status: calculateAccountLinkStatus(sourceOfTruth),
      userRef: (0, _dbUtils.createPointer)('User', userID)
    }));
  }
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------


  static createYodlee(yodleeProviderAccount, userID, providerID, providerName) {
    const sourceOfTruth = {
      loginForm: yodleeProviderAccount.refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED' ? yodleeProviderAccount.loginForm || null : null,
      providerAccount: yodleeProviderAccount,
      type: 'YODLEE'
    };
    return this.create(sourceOfTruth, userID, providerID, providerName);
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get providerName() {
    return this.__raw.providerName;
  }

  get providerRef() {
    return this.__raw.providerRef;
  }

  get sourceOfTruth() {
    return this.__raw.sourceOfTruth;
  }

  get status() {
    return this.__raw.status;
  }

  get userRef() {
    return this.__raw.userRef;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------
  get isLinking() {
    return this.status.startsWith('IN_PROGRESS');
  }

  get isPendingUserInput() {
    return this.status === 'MFA / PENDING_USER_INPUT';
  }

  get isLinkSuccess() {
    return this.status.startsWith('SUCCESS');
  }

  get isLinkFailure() {
    return this.status.startsWith('FAILURE');
  }

  get isInMFA() {
    return this.status.startsWith('MFA');
  }

  get loginForm() {
    const { sourceOfTruth } = this;

    switch (sourceOfTruth.type) {
      case 'EMPTY':
        {
          return null;
        }

      case 'YODLEE':
        {
          return this.sourceOfTruth.loginForm || null;
        }

      default:
        {
          return (0, _invariant2.default)(false, 'Unrecognized AccountLink sourceOfTruth: %s', sourceOfTruth.type);
        }
    }
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
  setSourceOfTruth(sourceOfTruth) {
    const now = new Date();
    return this.constructor.fromRaw(_extends({}, this.__raw, {
      sourceOfTruth,
      status: calculateAccountLinkStatus(sourceOfTruth),
      updatedAt: now
    }));
  }

  setStatus(status) {
    const now = new Date();
    const sourceOfTruth = this.sourceOfTruth.type === 'YODLEE' && status === 'MFA / WAITING_FOR_LOGIN_FORM' ? {
      loginForm: null,
      providerAccount: this.sourceOfTruth.providerAccount,
      type: 'YODLEE'
    } : this.sourceOfTruth;
    return this.constructor.fromRaw(_extends({}, this.__raw, {
      sourceOfTruth,
      status,
      updatedAt: now
    }));
  }

  setYodlee(yodleeProviderAccount) {
    const { sourceOfTruth } = this;
    (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE' || sourceOfTruth.type === 'EMPTY' && sourceOfTruth.target === 'YODLEE', 'Expecting refresh info to come from YODLEE');
    const loginForm = yodleeProviderAccount.refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED' ? yodleeProviderAccount.loginForm || this.loginForm : null;
    const newSourceOfTruth = {
      loginForm,
      providerAccount: yodleeProviderAccount,
      type: 'YODLEE'
    };
    return this.setSourceOfTruth(newSourceOfTruth);
  }
}

exports.default = AccountLink; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

AccountLink.collectionName = 'AccountLinks';
AccountLink.modelName = 'AccountLink';
function calculateAccountLinkStatus(sourceOfTruth) {
  if (sourceOfTruth.type === 'EMPTY') {
    return 'EMPTY';
  }

  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Calculating account link status only supports yodlee');

  const { refreshInfo } = sourceOfTruth.providerAccount;
  const { loginForm } = sourceOfTruth;

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
    return isMFAFailure ? 'FAILURE / MFA_FAILURE' : isLoginFailure ? 'FAILURE / BAD_CREDENTIALS' : isStatusCodeExternalServiceFailure(refreshInfo.statusCode) ? 'FAILURE / EXTERNAL_SERVICE_FAILURE' : 'FAILURE / INTERNAL_SERVICE_FAILURE';
  }
  return 'SUCCESS';
}

function isStatusCodeExternalServiceFailure(statusCode) {
  if (typeof statusCode !== 'number') {
    return false;
  }
  // You can find status codes here: https://developer.yodlee.com/Data_Model/Resource_Provider_Accounts
  return statusCode >= 400 && statusCode < 800;
}