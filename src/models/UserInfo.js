/* @flow */

import { Model } from './_Model';

import type { Map } from 'immutable';

import type { ID, ModelStub } from '../../types/core';

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

export type UserInfoCollection = Map<ID, UserInfo>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

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
