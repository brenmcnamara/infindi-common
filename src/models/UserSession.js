/* @flow */

import type { Device, ID, ModelStub, Pointer, Seconds } from '../types/core';

/**
 * A session of the user using the product. This includes information about
 * the start and end time of the session, device information, and location,
 * if available. The purpose of this object is for debugging, insight, and
 * security.
 *
 * Debugging: We may attach debugging logs to the session, so we can have a
 * sense of the user experience in case anything went wrong.
 *
 * Insight: We can use frequency of log-ins and activity during the session
 * to personalize our product for users.
 *
 * Security: By keeping track of when someone logs in and with which device,
 * we can detect security anonolies like: logging in from a new device,
 * logging in simultaneously in multiple places, etc...
 */
export type UserSession = ModelStub<'UserSession'> & {
  +device: Device,
  +sessionID: ID,
  +status: 'OPEN' | 'CLOSED' | 'NON_RESPONSIVE',
  +timeout: Seconds,
  +userRef: Pointer<'User'>,
};
