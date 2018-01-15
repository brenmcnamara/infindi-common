/* @flow */

import type { ModelStub, Pointer } from '../../types/core';

// TODO: May want to add the job request ref to the running download.
export type PlaidDownloadStatus =
  | {|
      +type: 'NOT_DOWNLOADED',
    |}
  | {|
      +type: 'RUNNING',
    |}
  | {|
      +downloadedAt: Date,
      +type: 'COMPLETE',
    |};

/**
 * A users credentials for plaid. These credentials allow a user to access
 * their plaid items given the relevant sandbox. Each credential is for a
 * specific plaid "item". Look here for plaid documentation on items:
 * https://plaid.com/docs/api/#retrieve-item
 *
 * NOTE: These credentials may expire relatively frequently and need to be
 * updated.
 */
export type PlaidCredentials = ModelStub<'PlaidCredentials'> & {
  +accessToken: string,
  +downloadStatus: PlaidDownloadStatus,
  +environment: 'sandbox' | 'development' | 'production',
  +itemID: string,
  +metadata: Object,
  +userRef: Pointer<'User'>,
};