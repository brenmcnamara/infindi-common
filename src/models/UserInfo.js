/* @flow */

import uuid from 'uuid/v4';

import { Model } from './Model';

import type Immutable from 'immutable';

import type { ID, ModelStub } from '../../types/core';
import type { SignUpForm } from './Auth';

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

export type UserInfoRaw = ModelStub<'UserInfo'> & {
  +firstName: string,
  +isAdmin: boolean,
  +isTestUser: boolean,
  +lastName: string,
};

export type UserInfoCollection = Immutable.Map<ID, UserInfo>;
export type UserInfoOrderedCollection = Immutable.OrderedMap<ID, UserInfo>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

/**
 * Core object representing a user and his / her data.
 */
export default class UserInfo extends Model<'UserInfo', UserInfoRaw> {
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  static collectionName = 'UserInfo';
  static modelName = 'UserInfo';

  __raw: UserInfoRaw; // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------
  static fromSignUpForm(signUpForm: SignUpForm): UserInfo {
    const id = uuid();
    const now = new Date();

    return this.fromRaw({
      createdAt: now,
      firstName: signUpForm.firstName,
      id,
      isAdmin: false,
      isTestUser: signUpForm.isTestUser,
      lastName: signUpForm.lastName,
      modelType: 'UserInfo',
      type: 'MODEL',
      updatedAt: now,
    });
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get firstName(): string {
    return this.__raw.firstName;
  }

  get isAdmin(): boolean {
    return this.__raw.isAdmin;
  }

  get isTestUser(): boolean {
    return this.__raw.isTestUser;
  }

  get lastName(): string {
    return this.__raw.lastName;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------

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
