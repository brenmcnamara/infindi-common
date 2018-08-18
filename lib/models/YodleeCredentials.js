'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Model = require('./Model');

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

/**
 * Core object representing a user and his / her data.
 */

// eslint-disable-next-line flowtype/generic-spacing
class YodleeCredentials extends _Model.Model {
  // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------
  static fromLoginNameAndPassword(id, loginName, password) {
    const now = new Date();
    return this.fromRaw({
      createdAt: now,
      id,
      loginName,
      modelType: 'YodleeCredentials',
      password,
      type: 'MODEL',
      updatedAt: now
    });
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  get loginName() {
    return this.__raw.loginName;
  }

  get password() {
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

exports.default = YodleeCredentials; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

YodleeCredentials.collectionName = 'YodleeCredentials';
YodleeCredentials.modelName = 'YodleeCredentials';