/* @flow */

import UserInfo from './UserInfo';

import { ModelFetcher } from './Model';

import type { UserInfoRaw } from './UserInfo';

class UserInfoFetcher extends ModelFetcher<'UserInfo', UserInfoRaw, UserInfo> {
  static collectionName = 'UserInfo';
  static modelName = 'UserInfo';
}

export default new UserInfoFetcher(UserInfo);
