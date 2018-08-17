'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _Model = require('./Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  static fromSignUpForm(signUpForm) {
    const id = (0, _v2.default)();
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