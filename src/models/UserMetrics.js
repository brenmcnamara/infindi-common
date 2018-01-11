/* @flow */

import Config from '../config';
import QueryBuilder from './_QueryBuilder';

import type { Dollars, ModelStub, ZeroToOneInclusive } from '../../types/core';

/**
 * Important metrics we keep track of for the user. These are used to provide
 * and gain more insight on the User's finances.
 */
export type UserMetrics = ModelStub<'UserMetrics'> & {
  +netWorth: Dollars | null,
  +savingsRate: ZeroToOneInclusive | null,
};

export function genFetchUserMetric(): Promise<UserMetrics | null> {
  return Promise.resolve().then(() => {
    const { currentUser } = Config.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return QueryBuilder.SingleDoc.fetch('UserMetrics')(currentUser.uid);
  });
}
