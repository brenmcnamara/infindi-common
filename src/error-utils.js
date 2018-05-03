/* @flow */

export type InfindiError = { errorCode: string, errorMessage: string };

// Infindi
export type ErrorCode =
  // Get argument-error when using invalid itemID with firebase.
  | 'auth/argument-error'
  | 'auth/disabled'
  | 'auth/insufficient-permission'
  | 'auth/invalid-credential'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'infindi/bad-request'
  | 'infindi/forbidden'
  | 'infindi/not-authenticated'
  | 'infindi/not-yet-implemented'
  | 'infindi/resource-not-found'
  | 'infindi/server-error'
  | 'message-queue/initialization-error'
  | 'plaid/invalidInput/invalidPublicToken'
  | 'plaid/invalidRequest/invalidField'
  | 'plaid/unknownError';

const ERROR_CODE_400 = ['auth/invalid-email', 'infindi/bad-request'];

const ERROR_CODE_401 = [
  'auth/argument-error',
  'auth/disabled',
  'auth/insufficient-permission',
  'auth/invalid-credential',
  'auth/user-disabled',
  'auth/user-not-found',
  'auth/wrong-password',
  'plaid/invalidPublicToken',
];

const ERROR_CODE_404 = ['infindi/resource-not-found'];

export function getStatusForErrorCode(code: string): number {
  if (ERROR_CODE_400.includes(code)) {
    return 400;
  } else if (ERROR_CODE_401.includes(code)) {
    return 401;
  } else if (ERROR_CODE_404.includes(code)) {
    return 404;
  }
  return 500;
}
