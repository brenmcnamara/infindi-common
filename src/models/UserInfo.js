/* @flow */

import type { Fuzzy, ModelStub, YearMonthDay } from '../../types/core';

/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
export type UserInfo = ModelStub<'UserInfo'> & {|
  +currentResidence: Fuzzy<Location>,
  +DOB: YearMonthDay,
  +firstName: string,
  +gender: 'MALE' | 'FEMALE',
  +isTestUser: bool,
  +lastName: string,
|};
