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


// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

class UserInfo extends _Model.Model {
  // TODO: Why do I need to define this?

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------
  static fromSignUpForm(id, signUpForm) {
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
      updatedAt: now
    });
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  get firstName() {
    return this.__raw.firstName;
  }

  get isAdmin() {
    return this.__raw.isAdmin;
  }

  get isTestUser() {
    return this.__raw.isTestUser;
  }

  get lastName() {
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

exports.default = UserInfo; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

UserInfo.collectionName = 'UserInfo';
UserInfo.modelName = 'UserInfo';