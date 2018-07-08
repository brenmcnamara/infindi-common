/* @flow */

import UserInfo from './UserInfo';

import { ModelFetcher } from './Model';

import type {
  UserInfoCollection,
  UserInfoOrderedCollection,
  UserInfoRaw,
} from './UserInfo';

class UserInfoFetcher extends ModelFetcher<
  'UserInfo',
  UserInfoRaw,
  UserInfo,
  UserInfoCollection,
  UserInfoOrderedCollection,
> {
  static collectionName = 'UserInfo';
  static modelName = 'UserInfo';
}

export default new UserInfoFetcher(UserInfo);
