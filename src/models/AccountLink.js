/* @flow */

import invariant from 'invariant';

import { createModelStub, createPointer } from '../db-utils';
import { Model } from './Model';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type {
  LoginForm as YodleeLoginForm,
  ProviderAccount as YodleeProviderAccount,
} from '../../types/yodlee-v1.0';
import type { Map } from 'immutable';

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

export type AccountLinkRaw = ModelStub<'AccountLink'> & {
  +providerName: string,
  +providerRef: Pointer<'Provider'>,
  +sourceOfTruth: SourceOfTruth,
  +status: AccountLinkStatus,
  +userRef: Pointer<'User'>,
};

export type SourceOfTruth = {|
  +loginForm: YodleeLoginForm | null,
  +providerAccount: YodleeProviderAccount,
  +type: 'YODLEE',
|};

export type AccountLinkStatus =
  | 'FAILURE / BAD_CREDENTIALS'
  | 'FAILURE / EXTERNAL_SERVICE_FAILURE'
  | 'FAILURE / INTERNAL_SERVICE_FAILURE'
  | 'FAILURE / MFA_FAILURE'
  | 'FAILURE / USER_INPUT_REQUEST_IN_BACKGROUND'
  | 'IN_PROGRESS / INITIALIZING'
  | 'IN_PROGRESS / VERIFYING_CREDENTIALS'
  | 'IN_PROGRESS / DOWNLOADING_DATA' // TODO: Rename this.
  | 'IN_PROGRESS / DOWNLOADING_FROM_SOURCE'
  | 'MFA / PENDING_USER_INPUT'
  | 'MFA / WAITING_FOR_LOGIN_FORM'
  | 'SUCCESS';

export type AccountLinkCollection = Map<ID, AccountLink>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

export default class AccountLink extends Model<'AccountLink', AccountLinkRaw> {
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  static collectionName = 'AccountLinks';
  static modelName = 'AccountLink';

  __raw: AccountLinkRaw; // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static create(
    sourceOfTruth: SourceOfTruth,
    userID: ID,
    providerID: ID,
    providerName: string,
  ): AccountLink {
    return this.fromRaw({
      ...createModelStub('AccountLink'),
      providerName,
      providerRef: createPointer('Provider', providerID),
      sourceOfTruth,
      status: calculateAccountLinkStatus(sourceOfTruth),
      userRef: createPointer('User', userID),
    });
  }

  static createYodlee(
    yodleeProviderAccount: YodleeProviderAccount,
    userID: ID,
    providerID: ID,
    providerName: string,
  ): AccountLink {
    const sourceOfTruth = {
      loginForm:
        yodleeProviderAccount.refreshInfo.additionalStatus ===
        'USER_INPUT_REQUIRED'
          ? yodleeProviderAccount.loginForm || null
          : null,
      providerAccount: yodleeProviderAccount,
      type: 'YODLEE',
    };
    return this.create(sourceOfTruth, userID, providerID, providerName);
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get providerName(): string {
    return this.__raw.providerName;
  }

  get providerRef(): Pointer<'Provider'> {
    return this.__raw.providerRef;
  }

  get sourceOfTruth(): SourceOfTruth {
    return this.__raw.sourceOfTruth;
  }

  get status(): AccountLinkStatus {
    return this.__raw.status;
  }

  get userRef(): Pointer<'User'> {
    return this.__raw.userRef;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------
  get isLinking(): boolean {
    return this.status.startsWith('IN_PROGRESS');
  }

  get isPendingUserInput(): boolean {
    return this.status === 'MFA / PENDING_USER_INPUT';
  }

  get isLinkSuccess(): boolean {
    return this.status.startsWith('SUCCESS');
  }

  get isLinkFailure(): boolean {
    return this.status.startsWith('FAILURE');
  }

  get isInMFA(): boolean {
    return this.status.startsWith('MFA');
  }

  get loginForm(): YodleeLoginForm | null {
    invariant(
      this.sourceOfTruth.type === 'YODLEE',
      'Expecting account link to come from YODLEE',
    );
    return this.sourceOfTruth.loginForm || null;
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
  setSourceOfTruth(sourceOfTruth: SourceOfTruth): AccountLink {
    const now = new Date();
    return this.constructor.fromRaw({
      ...this.__raw,
      sourceOfTruth,
      status: calculateAccountLinkStatus(sourceOfTruth),
      updatedAt: now,
    });
  }

  setStatus(status: AccountLinkStatus): AccountLink {
    const now = new Date();
    const sourceOfTruth =
      this.sourceOfTruth.type === 'YODLEE' &&
      status === 'MFA / WAITING_FOR_LOGIN_FORM'
        ? {
            loginForm: null,
            providerAccount: this.sourceOfTruth.providerAccount,
            type: 'YODLEE',
          }
        : this.sourceOfTruth;
    return this.constructor.fromRaw({
      ...this.__raw,
      sourceOfTruth,
      status,
      updatedAt: now,
    });
  }

  setYodlee(yodleeProviderAccount: YodleeProviderAccount): AccountLink {
    const { sourceOfTruth } = this;
    invariant(
      sourceOfTruth.type === 'YODLEE',
      'Expecting refresh info to come from YODLEE',
    );
    const loginForm =
      yodleeProviderAccount.refreshInfo.additionalStatus ===
      'USER_INPUT_REQUIRED'
        ? yodleeProviderAccount.loginForm || this.loginForm
        : null;
    const newSourceOfTruth = {
      loginForm,
      providerAccount: yodleeProviderAccount,
      type: 'YODLEE',
    };
    return this.setSourceOfTruth(newSourceOfTruth);
  }
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function calculateAccountLinkStatus(
  sourceOfTruth: SourceOfTruth,
): AccountLinkStatus {
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Calculating account link status only supports yodlee',
  );
  const { refreshInfo } = sourceOfTruth.providerAccount;
  const { loginForm } = sourceOfTruth;

  if (!refreshInfo.status) {
    return 'IN_PROGRESS / INITIALIZING';
  }
  if (refreshInfo.status === 'IN_PROGRESS') {
    return refreshInfo.additionalStatus === 'LOGIN_IN_PROGRESS'
      ? 'IN_PROGRESS / VERIFYING_CREDENTIALS'
      : refreshInfo.additionalStatus === 'USER_INPUT_REQUIRED'
        ? loginForm
          ? 'MFA / PENDING_USER_INPUT'
          : 'MFA / WAITING_FOR_LOGIN_FORM'
        : 'IN_PROGRESS / DOWNLOADING_DATA';
  }
  if (refreshInfo.status === 'FAILED') {
    const isMFAFailure =
      refreshInfo.statusMessage ===
      'MFA_INFO_NOT_PROVIDED_IN_REAL_TIME_BY_USER_VIA_APP';
    // NOTE: isLoginFailure is true during an MFA failure. Need to check
    // MFA failure first.
    const isLoginFailure = refreshInfo.additionalStatus === 'LOGIN_FAILED';
    return isMFAFailure
      ? 'FAILURE / MFA_FAILURE'
      : isLoginFailure
        ? 'FAILURE / BAD_CREDENTIALS'
        : 'FAILURE / INTERNAL_SERVICE_FAILURE';
  }
  return 'SUCCESS';
}
