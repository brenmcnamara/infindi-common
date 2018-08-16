/* @flow */

import uuid from 'uuid/v4';

import { Model } from './Model';

import type Immutable from 'immutable';

import type { ID, ModelStub } from '../../types/core';

export type YodleeCredentialsRaw = ModelStub<'YodleeCredentials'> & {
  +loginName: string,
  +password: string,
};

export type YodleeCredentialsCollection = Immutable.Map<ID, YodleeCredentials>;
// eslint-disable-next-line flowtype/generic-spacing
export type YodleeCredentialsOrderedCollection = Immutable.OrderedMap<
  ID,
  YodleeCredentials,
>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

/**
 * Core object representing a user and his / her data.
 */
export default class YodleeCredentials extends Model<
  'YodleeCredentials',
  YodleeCredentialsRaw,
> {
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  static collectionName = 'YodleeCredentials';
  static modelName = 'YodleeCredentials';

  __raw: YodleeCredentialsRaw; // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------
  static fromLoginNameAndPassword(
    loginName: string,
    password: string,
  ): YodleeCredentials {
    const id = uuid();
    const now = new Date();

    return this.fromRaw({
      createdAt: now,
      id,
      loginName,
      modelType: 'YodleeCredentials',
      password,
      type: 'MODEL',
      updatedAt: now,
    });
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get loginName(): string {
    return this.__raw.loginName;
  }

  get password(): string {
    return this.__raw.password;
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
