/* @flow */

import UserInfo from './UserInfo';

import { ModelMutator } from './Model';

import type { UserInfoRaw } from './UserInfo';

class UserInfoMutator extends ModelMutator<'UserInfo', UserInfoRaw, UserInfo> {
  static collectionName = 'UserInfo';
  static modelName = 'UserInfo';
}

export default new UserInfoMutator(UserInfo);
