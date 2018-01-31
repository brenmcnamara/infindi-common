'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAccountsCollection = getAccountsCollection;
exports.createAccountFromYodleeAccount = createAccountFromYodleeAccount;
exports.genFetchAccount = genFetchAccount;
exports.genCreateAccount = genCreateAccount;
exports.genUpdateAccount = genUpdateAccount;
exports.genUpsertAccountFromYodleeAccount = genUpsertAccountFromYodleeAccount;
exports.getAccountName = getAccountName;
exports.getBalance = getBalance;
exports.getGroupType = getGroupType;
exports.getInstitution = getInstitution;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAccountsCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Accounts');
}

function createAccountFromYodleeAccount(yodleeAccount, userID) {
  return _extends({}, (0, _dbUtils.createModelStub)('Account'), {
    shouldShowUser: calculateShouldShowUser(yodleeAccount),
    sourceOfTruth: {
      type: 'YODLEE',
      value: yodleeAccount
    },
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function genFetchAccount(accountID) {
  return getAccountsCollection().doc(accountID).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateAccount(account) {
  return getAccountsCollection().doc(account.id).set(account);
}

function genUpdateAccount(account) {
  return getAccountsCollection().doc(account.id).update(account);
}

function genUpsertAccountFromYodleeAccount(yodleeAccount, userID) {
  return getAccountsCollection().where('sourceOfTruth.type', '==', 'YODLEE').where('sourceOfTruth.value.id', '==', yodleeAccount.id).get().then(snapshot => {
    const account = snapshot.docs.length > 0 && snapshot.docs[0].exists ? snapshot.docs[0].data() : null;
    if (!account) {
      // No account. Create a new one.
      const account = createAccountFromYodleeAccount(yodleeAccount, userID);
      return genCreateAccount(account);
    }
    // Update the existing account.
    const now = new Date();
    const updateAccount = _extends({}, account, {
      updatedAt: now,
      shouldShowUser: calculateShouldShowUser(yodleeAccount),
      sourceOfTruth: { type: 'YODLEE', value: yodleeAccount }
    });
    return genUpdateAccount(updateAccount);
  });
}

function getAccountName(account) {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        return sourceOfTruth.value.accountName;
      }

    default:
      return (0, _invariant2.default)(false, 'Unrecognized account sourceOfTruth.type %s', sourceOfTruth.type);
  }
}

function getBalance(account) {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        const { balance } = sourceOfTruth.value;
        return balance ? balance.amount : 0;
      }

    default:
      {
        return (0, _invariant2.default)(false, 'Unrecognized account sourceOfTruth.type %s', sourceOfTruth.type);
      }
  }
}

function getGroupType(account) {
  return 'AVAILABLE_CASH';
}

function getInstitution(account) {
  return 'CHASE';
}

function calculateShouldShowUser(yodleeAccount) {
  return Boolean(yodleeAccount.accountType !== 'REWARD_POINTS' && yodleeAccount.balance);
}