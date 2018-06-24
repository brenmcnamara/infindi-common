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

/**
 * A transaction on a particular account.
 */


// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

class Transaction extends _Model.Model {
  // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static createYodlee(yodleeTransaction, userID, accountID, accountLinkID) {
    const date = yodleeTransaction.postDate || yodleeTransaction.transactionDate;
    (0, _invariant2.default)(date, 'Expecting either "postDate" or "transactionDate" property to be set on yodlee transaction: %s', yodleeTransaction.id);
    const dateComponents = date.split('-').map(c => parseInt(c, 10));
    const transactionDate = new Date(Date.UTC(dateComponents[0], dateComponents[1] - 1, dateComponents[2]));

    return this.fromRaw(_extends({
      accountLinkRef: (0, _dbUtils.createPointer)('AccountLink', accountLinkID),
      accountRef: (0, _dbUtils.createPointer)('Account', accountID)
    }, (0, _dbUtils.createModelStub)('Transaction'), {
      sourceOfTruth: {
        type: 'YODLEE',
        value: yodleeTransaction
      },
      transactionDate,
      userRef: (0, _dbUtils.createPointer)('User', userID)
    }));
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  get accountLinkRef() {
    return this.__raw.accountLinkRef;
  }

  get accountRef() {
    return this.__raw.accountRef;
  }

  get sourceOfTruth() {
    return this.__raw.sourceOfTruth;
  }

  get transactionDate() {
    return this.__raw.transactionDate;
  }

  get userRef() {
    return this.__raw.userRef;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------

  get title() {
    const { sourceOfTruth } = this;
    (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
    return sourceOfTruth.value.description.original;
  }

  get amount() {
    const { sourceOfTruth } = this;
    (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
    const dollars = sourceOfTruth.value.amount.amount;
    const isPositive = sourceOfTruth.value.baseType === 'CREDIT';
    return isPositive ? dollars : -dollars;
  }

  get category() {
    const { sourceOfTruth } = this;
    (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'Expecting transaction to come from YODLEE');
    return sourceOfTruth.value.category;
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
}

exports.default = Transaction; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

Transaction.collectionName = 'Transactions';
Transaction.modelName = 'Transaction';