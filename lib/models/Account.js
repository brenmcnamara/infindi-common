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
exports.getBalance = getBalance;

var _dbUtils = require('../db-utils');

var _config = require('../config');

function getAccountsCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Accounts');
}

function createAccountFromYodleeAccount(yodleeAccount, userID) {
  return _extends({}, (0, _dbUtils.createModelStub)('Account'), {
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
      sourceOfTruth: { type: 'YODLEE', value: yodleeAccount }
    });
    return genUpdateAccount(updateAccount);
  });
}

function getBalance(account) {
  return 0;
}