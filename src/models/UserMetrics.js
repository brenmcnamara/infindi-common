/* @flow */

import type { Dollars, ModelStub, ZeroToOneInclusive } from '../../types/core';

/**
 * Important metrics we keep track of for the user. These are used to provide
 * and gain more insight on the User's finances.
 */
export type UserMetrics = ModelStub<'UserMetrics'> & {
  +netWorth: Dollars | null,
  +savingsRate: ZeroToOneInclusive | null,
};
