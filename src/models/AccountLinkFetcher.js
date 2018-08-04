/* @flow */

import AccountLink from './AccountLink';

import { ModelFetcher } from './Model';

import type {
  AccountLinkCollection,
  AccountLinkOrderedCollection,
  AccountLinkRaw,
} from './AccountLink';

class AccountLinkFetcher extends ModelFetcher<
  'AccountLink',
  AccountLinkRaw,
  AccountLink,
  AccountLinkCollection,
  AccountLinkOrderedCollection,
> {
  static collectionName = 'AccountLinks';
  static modelName = 'AccountLink';
}

export default new AccountLinkFetcher(AccountLink);
