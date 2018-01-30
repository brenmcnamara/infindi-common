/* @flow */

import invariant from 'invariant';

import { getFirebaseAdminOrClient } from '../config';

/**
 * NOTE: THIS DATA IS HIGHLY SENSITIVE AND SHOULD NEVER BE SENT ACROSS ANY
 * NETWORK REQUEST. FOR INTERNAL USE ONLY.
 */

import type { ID, ModelStub } from '../../types/core';

export type YodleeCredentials = ModelStub<'YodleeCredentials'> & {
  +id: ID,
  +loginName: string,
  +password: string,
};

export function getYodleeCredentialsCollection() {
  return getFirebaseAdminOrClient()
    .firestore()
    .collection('YodleeCredentials');
}

export function genFetchYodleeCredentials(
  userID: ID,
): Promise<YodleeCredentials> {
  return getYodleeCredentialsCollection()
    .doc(userID)
    .get()
    .then(doc => {
      invariant(doc.exists, 'Yodlee Credentials not found for user %s', userID);
      return doc.data();
    });
}
