/* @flow */

import Config from '../config';

import type { User as FirebaseUser } from '../../types/firebase';
import type { UserInfo } from './UserInfo';
import type { UserMetrics } from './UserMetrics';

export type LoginCredentials = {|
  +email: string,
  +password: string,
|};

export type LoginPayload = {|
  +firebaseUser: FirebaseUser,
  +idToken: string,
  +userInfo: UserInfo,
  +userMetrics: UserMetrics,
|};

/**
 * Login a user with the given email and password.
 */
export function genLogin(
  email: string,
  password: string,
): Promise<FirebaseUser | null> {
  return Config.getFirebase()
    .auth()
    .signInWithEmailAndPassword(email, password);
}

/**
 * Logout the current user.
 */
export function genLogout(): Promise<void> {
  return Config.getFirebase()
    .auth()
    .signOut();
}
