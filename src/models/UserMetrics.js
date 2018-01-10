/* @flow */

import Config from '../config';

import type { Dollars, ModelStub, ZeroToOneInclusive } from '../../types/core';

/**
 * Important metrics we keep track of for the user. These are used to provide
 * and gain more insight on the User's finances.
 */
export type UserMetrics = ModelStub<'UserMetrics'> & {
  +netWorth: Dollars | null,
  +savingsRate: ZeroToOneInclusive | null,
};

/**
 * Generate the user metrics of the logged in user. Null if no user is logged
 * in.
 */
export function genUserMetrics(): Promise<UserMetrics | null> {
  return Promise.resolve()
    .then(() => {
      const { currentUser } = Config.getFirebase().auth();
      if (!currentUser) {
        return null;
      }
      return Config.getFirebase()
        .firestore()
        .collection('UserMetrics')
        .doc(currentUser.uid)
        .get();
    })
    .then(document => {
      return document && document.exists ? document.data() : null;
    });
}
