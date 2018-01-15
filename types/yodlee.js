/* @flow */

export type DateString = string; // yyyy-MM-dd

export type DateTimeString = string; // 2017-11-14T04:23:10Z

export type Container =
  | 'bank'
  | 'creditCard'
  | 'investment'
  | 'insurance'
  | 'loan'
  | 'otherAssets'
  | 'otherLiabilities'
  | 'realEstate'
  | 'reward'
  | 'bill';

export type ContainerAttribute = {|
  +numberOfTransactionDays: number,
|};

// NOTE: Javascript does not support longs. Need to extract this from the
// request as a string to avoid overflows.
export type Long = number;

// TODO: MORE HERE
export type Currency = 'USD';

// TODO: MORE HERE
export type DateFormat = 'MM/dd/yyyy';

// TODO: MORE HERE
export type Locale = 'en_US';

// TODO: MORE HERE
export type Timezone = 'PST';

export type Preference = {|
  +currency: Currency,
  +dateFormat: DateFormat,
  +locale: Locale,
  +timezone: Timezone,
|};

export type AccessToken = {|
  +appId: string,
  +url: string,
  +value: string,
|};

export type User = {|
  +id: Long,
  +loginName: string,
  +name: {|
    +first: string,
    +last: string,
  |},
  +preferences: Preference,
  +roleType: 'INDIVIDUAL',
  +session: {|
    +userSession: string,
  |},
|};

export type Provider = {|
  +authType: 'OAUTH' | 'CREDENTIALS' | 'MFA_CREDENTIALS',
  +baseURL: string,
  +containerAttributes: { [name: Container]: ContainerAttribute },
  +containerNames: Array<Container>,
  +favicon: string,
  +forgetPasswordUrl: string,
  +id: Long,
  +isAutoRefreshEnabled: bool,
  +languageISOCode: string,
  +lastModified: DateTimeString,
  +loginURL: string,
  +logo: string,
  +mfaType: string,
  +name: string,
  +oAuthSite: bool,
  +PRIORITY: 'SUGGESTED' | 'COBRAND' | 'POPULAR' | 'SEARCH',
  +primaryLanguageISOCode: string,
  +status: 'Supported' | 'Beta',
|};

export type ProviderAccount = {|
  +aggregationSource: 'USER' | 'SYSTEM',
  +createdDate: DateString,
  +id: Long,
  +isManual: bool,
  +lastUpdated: DateTimeString,
  +loginForm: LoginForm,
  +providerId: Long,
  +refreshInfo: RefreshInfo,
|};

// Account types and containers can be found here:
// https://developer.yodlee.com/Data_Model/Resource_Provider_Accounts
export type Account = {|
  +accountNumber: string,
  +accountStatus: 'ACTIVE' | 'TO_BE_CLOSED' | string,
  +accountType: 'INDIVIDUAL' | string,
  +aggregationSource: 'USER' | 'SYSTEM',
  +availableBalance?: AccountBalance,
  +balance?: AccountBalance,
  +bankTransferCode?: {| +id: string |},
  +cash?: AccountBalance, // Found this field in my schwab account.
  +CONTAINER: string,
  +createdDate: DateTimeString,
  +currentBalance?: AccountBalance,
  +holderProfile?: Object, // Found this field in my schwab account.
  +id: Long,
  +includeInNetWorth?: bool,
  +isAsset: bool,
  +isManual: bool,
  +lastUpdated: DateTimeString,
  +providerAccountId: Long,
  +providerId: string,
  +providerName: string,
  +refreshinfo: RefreshInfo,
|};

export type AccountBalance = {|
  +amount: number,
  +currency: Currency,
|};

export type RefreshInfo = {|
  +lastRefreshed: DateTimeString,
  +lastRefreshAttempt: DateTimeString,
  +nextRefreshScheduled: DateTimeString,
  +status: string,
  +statusCode: number,
  +statusMessage: string,
|};

export type LoginForm = {||};
