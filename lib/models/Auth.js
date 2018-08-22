'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genLogin = genLogin;
exports.genLogout = genLogout;
exports.validateSignUpForm = validateSignUpForm;

var _FindiError = require('../FindiError');

var _FindiError2 = _interopRequireDefault(_FindiError);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line
// const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

/**
 * Login a user with the given email and password.
 */
function genLogin(email, password) {
  return (0, _config.getFirebase)().auth().signInWithEmailAndPassword(email, password);
}

/**
 * Logout the current user.
 */
function genLogout() {
  return (0, _config.getFirebase)().auth().signOut();
}

function validateSignUpForm(signUpForm) {
  // TODO: Having some wierd issues with the email regex above, trying something
  // stupidly simple for now.
  if (!signUpForm.email.includes('@')) {
    return notValidWithError(_FindiError2.default.fromRaw({
      errorCode: 'CORE / VALIDATION_ERROR',
      errorMessage: 'Sign up form has invalid email address'
    }));
  } else if (signUpForm.firstName.length < 2) {
    return notValidWithError(_FindiError2.default.fromRaw({
      errorCode: 'CORE / VALIDATION_ERROR',
      errorMessage: 'Sign up form has invalid first name'
    }));
  } else if (signUpForm.lastName.length < 2) {
    return notValidWithError(_FindiError2.default.fromRaw({
      errorCode: 'CORE / VALIDATION_ERROR',
      errorMessage: 'Sign up form has invalid last name'
    }));
  } else if (signUpForm.password.length < 6) {
    return notValidWithError(_FindiError2.default.fromRaw({
      errorCode: 'CORE / VALIDATION_ERROR',
      errorMessage: 'Sign up form has invalid password'
    }));
  }

  return valid();
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function valid() {
  return { type: 'VALID' };
}

function notValidWithError(error) {
  return { error, type: 'NOT_VALID' };
}