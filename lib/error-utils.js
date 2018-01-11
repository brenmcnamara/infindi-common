'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusForErrorCode = getStatusForErrorCode;
exports.getErrorForPlaidError = getErrorForPlaidError;


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

function getErrorForPlaidError(plaidError) {
  // TODO: Just do some string manipulation here to get this in the correct
  // format, don't write a case for each state.
  // flatten the type / code hierarchy so we can handle everything in one
  // branch.
  const plaidErrorType = `${plaidError.error_type}/${plaidError.error_code}`;
  switch (plaidErrorType) {
    case 'INVALID_INPUT/INVALID_PUBLIC_TOKEN':
      return {
        errorCode: 'plaid/invalidInput/invalidPublicToken',
        errorMessage: plaidError.error_message
      };
    case 'INVALID_REQUEST/INVALID_FIELD':
      return {
        errorCode: 'plaid/invalidRequest/invalidField',
        errorMessage: plaidError.error_message
      };
    default:
      return {
        errorCode: 'plaid/unknownError',
        errorMessage: plaidError.error_message
      };
  }
}