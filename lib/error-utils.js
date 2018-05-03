'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusForErrorCode = getStatusForErrorCode;
const ERROR_CODE_400 = ['auth/invalid-email', 'infindi/bad-request'];

// Infindi


const ERROR_CODE_401 = ['auth/argument-error', 'auth/disabled', 'auth/insufficient-permission', 'auth/invalid-credential', 'auth/user-disabled', 'auth/user-not-found', 'auth/wrong-password', 'plaid/invalidPublicToken'];

const ERROR_CODE_404 = ['infindi/resource-not-found'];

function getStatusForErrorCode(code) {
  if (ERROR_CODE_400.includes(code)) {
    return 400;
  } else if (ERROR_CODE_401.includes(code)) {
    return 401;
  } else if (ERROR_CODE_404.includes(code)) {
    return 404;
  }
  return 500;
}