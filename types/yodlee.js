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

export type ContainerAllCaps =
  | 'BANK'
  | 'CREDITCARD'
  | 'INVESTMENT'
  | 'INSURANCE'
  | 'LOAN'
  | 'OTHERASSETS'
  | 'OTHERLIABILITIES'
  | 'REALESTATE'
  | 'REWARD'
  | 'BILL';

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

export type Provider = {
  +additionalDataSet?: any,
  +authType: 'OAUTH' | 'CREDENTIALS' | 'MFA_CREDENTIALS',
  +baseUrl: string,
  +containerAttributes: { [name: ContainerAllCaps]: ContainerAttribute },
  +containerNames: Array<Container>,
  +countryISOCode: 'US' | string,
  +favicon: string,
  +forgetPasswordUrl?: string,
  +id: Long,
  +isAutoRefreshEnabled: bool,
  +languageISOCode: string,
  +lastModified: DateTimeString,
  +loginUrl: string,
  +logo: string,
  +mfaType?: string,
  +name: string,
  +oAuthSite: bool,
  +PRIORITY: 'SUGGESTED' | 'COBRAND' | 'POPULAR' | 'SEARCH',
  +primaryLanguageISOCode: string,
  +status: 'Supported' | 'Beta',
};

export type ProviderFull = Provider & {
  +loginForm: LoginForm,
};

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
  +additionalStatus?: string,
  +lastRefreshed: DateTimeString,
  +lastRefreshAttempt: DateTimeString,
  +nextRefreshScheduled?: DateTimeString,
  +status: string,
  +statusCode: number,
  +statusMessage: string,
|};

export type LoginForm = {|
  +forgetPasswordURL?: string,
  +formType: 'login' | string, // TODO
  +id: Long,
  +row: Array<LoginEntry>,
|};

export type LoginEntry = {|
  +id: Long,
  +label: string,
  +fieldRowChoice: string,
  +form: string,
  +field: Array<{|
    +id: Long,
    +isOptional: bool,
    +maxLength: number,
    +name: 'LOGIN' | 'PASSWORD' | string, // TODO
    +type: 'text' | 'password' | string, // TODO
    +value: string,
    +valueEditable: bool,
  |}>,
|};
