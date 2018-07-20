/* @flow */

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
