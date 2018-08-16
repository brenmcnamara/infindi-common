/* @flow */

import FindiError from '../FindiError';

import { getFirebase } from '../config';

import type UserInfo from './UserInfo';

import type { User as FirebaseUser } from '../../types/firebase';

export type LoginCredentials = {|
  +email: string,
  +password: string,
|};

export type LoginPayload = {|
  +firebaseUser: FirebaseUser,
  +idToken: string,
  +userInfo: UserInfo,
|};

export type SignUpForm = {
  +email: string,
  +firstName: string,
  +isTestUser: boolean,
  +lastName: string,
  +password: string,
};

export type ValidationResult =
  | {| +type: 'VALID' |}
  | {| +error: FindiError, +type: 'NOT_VALID' |};

// eslint-disable-next-line
const EMAIL_REGEXP = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;

/**
 * Login a user with the given email and password.
 */
export function genLogin(
  email: string,
  password: string,
): Promise<FirebaseUser | null> {
  return getFirebase()
    .auth()
    .signInWithEmailAndPassword(email, password);
}

/**
 * Logout the current user.
 */
export function genLogout(): Promise<void> {
  return getFirebase()
    .auth()
    .signOut();
}

export function validateSignUpForm(signUpForm: SignUpForm): ValidationResult {
  if (!EMAIL_REGEXP.test(signUpForm.email)) {
    return notValidWithError(
      FindiError.fromRaw({
        errorCode: 'CORE / VALIDATION_ERROR',
        errorMessage: 'Sign up form has invalid email address',
      }),
    );
  } else if (signUpForm.firstName.length < 2) {
    return notValidWithError(
      FindiError.fromRaw({
        errorCode: 'CORE / VALIDATION_ERROR',
        errorMessage: 'Sign up form has invalid first name',
      }),
    );
  } else if (signUpForm.lastName.length < 2) {
    return notValidWithError(
      FindiError.fromRaw({
        errorCode: 'CORE / VALIDATION_ERROR',
        errorMessage: 'Sign up form has invalid last name',
      }),
    );
  } else if (signUpForm.password.length < 6) {
    return notValidWithError(
      FindiError.fromRaw({
        errorCode: 'CORE / VALIDATION_ERROR',
        errorMessage: 'Sign up form has invalid password',
      }),
    );
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

function notValidWithError(error: FindiError) {
  return { error, type: 'NOT_VALID' };
}
