/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { Model } from './Model';

import type Immutable from 'immutable';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { Transaction as YodleeTransaction } from '../../types/yodlee-v1.0';

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

export type TransactionRaw = ModelStub<'Transaction'> & {
  +accountLinkRef: Pointer<'AccountLink'>,
  +accountRef: Pointer<'Account'>,
  +sourceOfTruth: SourceOfTruth,
  +transactionDate: Date,
  +userRef: Pointer<'User'>,
};

export type SourceOfTruth = {|
  +type: 'YODLEE',
  +value: YodleeTransaction,
|};

export type TransactionCollection = Immutable.Map<ID, Transaction>;
// eslint-disable-next-line flowtype/generic-spacing
export type TransactionOrderedCollection = Immutable.OrderedMap<
  ID,
  Transaction,
>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

/**
 * A transaction on a particular account.
 */
export default class Transaction extends Model<'Transaction', TransactionRaw> {
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  static collectionName = 'Transactions';
  static modelName = 'Transaction';

  __raw: TransactionRaw; // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static createYodlee(
    yodleeTransaction: YodleeTransaction,
    userID: ID,
    accountID: ID,
    accountLinkID: ID,
  ): Transaction {
    const date =
      yodleeTransaction.postDate || yodleeTransaction.transactionDate;
    invariant(
      date,
      'Expecting either "postDate" or "transactionDate" property to be set on yodlee transaction: %s',
      yodleeTransaction.id,
    );
    const dateComponents = date.split('-').map(c => parseInt(c, 10));
    const transactionDate = new Date(
      Date.UTC(dateComponents[0], dateComponents[1] - 1, dateComponents[2]),
    );

    return this.fromRaw({
      accountLinkRef: createPointer('AccountLink', accountLinkID),
      accountRef: createPointer('Account', accountID),
      ...createModelStub('Transaction'),
      sourceOfTruth: {
        type: 'YODLEE',
        value: yodleeTransaction,
      },
      transactionDate,
      userRef: createPointer('User', userID),
    });
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get accountLinkRef(): Pointer<'AccountLink'> {
    return this.__raw.accountLinkRef;
  }

  get accountRef(): Pointer<'Account'> {
    return this.__raw.accountRef;
  }

  get sourceOfTruth(): SourceOfTruth {
    return this.__raw.sourceOfTruth;
  }

  get transactionDate(): Date {
    return this.__raw.transactionDate;
  }

  get userRef(): Pointer<'User'> {
    return this.__raw.userRef;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------

  get title(): string {
    const { sourceOfTruth } = this;
    invariant(
      sourceOfTruth.type === 'YODLEE',
      'Expecting transaction to come from YODLEE',
    );
    return sourceOfTruth.value.description.original;
  }

  get amount(): number {
    const { sourceOfTruth } = this;
    invariant(
      sourceOfTruth.type === 'YODLEE',
      'Expecting transaction to come from YODLEE',
    );
    const dollars = sourceOfTruth.value.amount.amount;
    const isPositive = sourceOfTruth.value.baseType === 'CREDIT';
    return isPositive ? dollars : -dollars;
  }

  get category(): string {
    const { sourceOfTruth } = this;
    invariant(
      sourceOfTruth.type === 'YODLEE',
      'Expecting transaction to come from YODLEE',
    );
    return sourceOfTruth.value.category;
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------
