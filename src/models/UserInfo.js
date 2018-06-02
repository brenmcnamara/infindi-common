/* @flow */

import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub } from '../../types/core';

/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
export type UserInfo = ModelStub<'UserInfo'> & {
  +firstName: string,
  +isAdmin: boolean,
  +isTestUser: boolean,
  +lastName: string,
};

export function getUserInfoCollection() {
  return getFirebaseAdminOrClient().firestore().collection('UserInfo');
}

export async function genFetchUserInfo(id: ID): Promise<UserInfo | null> {
  const doc = await getUserInfoCollection().doc(id).get();
  return doc.exists ? doc.data() : null;
}

export async function genSetUserInfo(userInfo: UserInfo) {
  return getUserInfoCollection().doc(userInfo.id).set(userInfo);
}
