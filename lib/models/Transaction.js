'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genDoesYodleeTransactionExist = exports.genFetchTransactionsForAccount = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let genFetchTransactionsForAccount = exports.genFetchTransactionsForAccount = (() => {
  var _ref = _asyncToGenerator(function* (account, limit = 20) {
    let query = getTransactionCollection().where('accountRef.refID', '==', account.id)
    // Transaction dates are rounded to the day, so we sort by createdDate as
    // well as a fallback.
    .orderBy('transactionDate', 'desc').orderBy('sourceOfTruth.value.createdDate', 'desc');
    if (limit !== Infinity) {
      query = query.limit(limit);
    }
    const snapshot = yield query.get();

    return snapshot.docs.filter(function (doc) {
      return doc.exists;
    }).map(function (doc) {
      return doc.data();
    });
  });

  return function genFetchTransactionsForAccount(_x) {
    return _ref.apply(this, arguments);
  };
})();

let genDoesYodleeTransactionExist = exports.genDoesYodleeTransactionExist = (() => {
  var _ref2 = _asyncToGenerator(function* (yodleeTransaction) {
    const doc = yield getTransactionCollection().where('sourceOfTruth.type', '==', 'YODLEE').where('sourceOfTruth.value.id', '==', yodleeTransaction.id);
    return Boolean(doc && doc.exists);
  });

  return function genDoesYodleeTransactionExist(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

exports.getTransactionCollection = getTransactionCollection;
exports.createTransactionYodlee = createTransactionYodlee;
exports.genCreateTransaction = genCreateTransaction;
exports.getTitle = getTitle;
exports.getAmount = getAmount;
exports.getCategory = getCategory;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * A bank transaction
 */
function getTransactionCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Transactions');
}

function createTransactionYodlee(yodleeTransaction, userID, accountID) {
  const dateComponents = yodleeTransaction.postDate.split('-').map(c => parseInt(c, 10));
  const transactionDate = new Date(Date.UTC(dateComponents[0], dateComponents[1] - 1, dateComponents[2]));

  return _extends({
    accountRef: (0, _dbUtils.createPointer)('Account', accountID)
  }, (0, _dbUtils.createModelStub)('Transaction'), {
    sourceOfTruth: {
      type: 'YODLEE',
      value: yodleeTransaction
    },
    transactionDate,
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function genCreateTransaction(transaction) {
  return getTransactionCollection().doc(transaction.id).set(transaction);
}

function getTitle(transaction) {
  const { sourceOfTruth } = transaction;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
  return sourceOfTruth.value.description.original;
}

function getAmount(transaction) {
  const { sourceOfTruth } = transaction;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
  const dollars = sourceOfTruth.value.amount.amount;
  const isPositive = sourceOfTruth.value.baseType === 'CREDIT';
  return isPositive ? dollars : -dollars;
}

function getCategory(transaction) {
  const { sourceOfTruth } = transaction;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
  return sourceOfTruth.value.category;
}