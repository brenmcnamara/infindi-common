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

// Yodlee Docs: https://developer.yodlee.com/Data_Model/Data_Types
// Currency is a 3-letter ISO code:
// https://www.ibm.com/support/knowledgecenter/en/SSZLC2_7.0.0/com.ibm.commerce.payments.developer.doc/refs/rpylerl2mst97.htm
export type Money = {|
  +amount: number,
  +currency: string,
|};

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

// https://developer.yodlee.com/Data_Model/Resource_Transactions
export type Merchant = {|
  +categoryLabel: Array<string>,
  +id: string,
  +source: 'YODLEE' | 'FACTUAL',
  // Note that this is 0, 0 if unknown.
  coordinates: { latititude: number, longitude: number },
|};

export type RefreshStatus =
  | 'REFRESH_TRIGGERED'
  | 'REFRESH_COMPLETED'
  | 'LOGIN_FAILURE';

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
  +isAutoRefreshEnabled: boolean,
  +languageISOCode: string,
  +lastModified: DateTimeString,
  +loginUrl: string,
  +logo: string,
  +mfaType?: string,
  +name: string,
  +oAuthSite: boolean,
  +PRIORITY?: 'SUGGESTED' | 'COBRAND' | 'POPULAR' | 'SEARCH',
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
  +isManual: boolean,
  +lastUpdated: DateTimeString,
  +loginForm?: LoginForm,
  +providerId: Long,
  +refreshInfo: RefreshInfo,
|};

// Account types and containers can be found here:
// https://developer.yodlee.com/Data_Model/Resource_Provider_Accounts
export type Account = {|
  +accountName?: string,
  +accountNumber?: string,
  +accountStatus: 'ACTIVE' | 'TO_BE_CLOSED' | string,
  +accountType: 'INDIVIDUAL' | string,
  +aggregationSource: 'USER' | 'SYSTEM',
  +availableBalance?: AccountBalance,
  +balance?: AccountBalance,
  +bankTransferCode?: {| +id: string |},
  +cash?: AccountBalance, // Found this field in my schwab account.
  +CONTAINER: Container,
  +createdDate: DateTimeString,
  +currentBalance?: AccountBalance,
  +holderProfile?: Object, // Found this field in my schwab account.
  +id: Long,
  +includeInNetWorth?: boolean,
  +isAsset: boolean,
  +isManual: boolean,
  +lastUpdated: DateTimeString,
  +providerAccountId: Long,
  +providerId: string,
  +providerName: string,
  +refreshinfo: RefreshInfo,
|};

export type Transaction = {|
  +accountId: Long,
  +amount: Money,
  +baseType: TransactionBaseType,
  +categoryId: Long,
  +categoryType: string,
  +category: string,
  +categorySource: string,
  +createdDate: DateTimeString,
  +date: DateString,
  +description: TransactionDescription,
  +highLevelCategoryId: Long,
  +id: Long,
  +isManual: boolean,
  +lastUpdated: DateTimeString,
  +merchant: Merchant,
  +postDate?: DateString,
  +status: TransactionStatus,
  +subType: string,
  +transactionDate?: DateString,
  +type: TransactionType,
|};

// https://developer.yodlee.com/Data_Model/Resource_Transactions#Transaction_Base_Type
export type TransactionBaseType = 'DEBIT' | 'CREDIT';

export type TransactionDescription = {|
  +original: string,
  +simple: string,
|};

// https://developer.yodlee.com/Data_Model/Resource_Transactions#Transaction_Type
export type TransactionType = string;

// https://developer.yodlee.com/Data_Model/Resource_Transactions#Transaction_Status
export type TransactionStatus = 'POSTED' | 'PENDING' | 'SCHEDULED';

export type AccountBalance = {|
  +amount: number,
  +currency: Currency,
|};

export type RefreshInfo = {|
  +additionalStatus?: RefreshInfoAdditionalStatus,
  +lastRefreshed: DateTimeString,
  +lastRefreshAttempt: DateTimeString,
  +nextRefreshScheduled?: DateTimeString,
  +refreshStatus?: string,
  +status?: RefreshInfoStatus,
  +statusCode: number,
  +statusMessage: string,
|};

export type RefreshInfoStatus =
  | 'SUCCESS'
  | 'FAILED'
  | 'IN_PROGRESS'
  | 'PARTIAL_SUCCESS';

export type RefreshInfoAdditionalStatus =
  | 'LOGIN_IN_PROGRESS'
  | 'USER_INPUT_REQUIRED'
  | 'LOGIN_SUCCESS'
  | 'ACCOUNT_SUMMARY_RETRIEVED'
  | 'NEVER_INITIATED'
  | 'LOGIN_FAILED'
  | 'REQUEST_TIME_OUT'
  | 'PARTIAL_DATA_RETRIEVED'
  | 'PARTIAL_DATA_RETRIEVED_REM_SCHED';

// -----------------------------------------------------------------------------
//
// LOGIN FORM
//
// -----------------------------------------------------------------------------

export type LoginForm =
  | {|
      +forgetPasswordURL?: string,
      +formType: 'login',
      +id: Long | string,
      +row: Array<LoginRow>,
    |}
  | {|
      +formType: 'questionAndAnswer',
      +mfaInfoText: string,
      +mfaInfoTitle: string,
      +mfaTimeout: Long,
      +row: Array<LoginRow>,
    |};

export type LoginRow = {|
  +id: Long | string,
  +label: string,
  +fieldRowChoice: string,
  +form: string,
  +field: Array<LoginField>,
|};

export type LoginField = LoginField$General | LoginField$Option;

export type LoginField$General = {|
  +id: Long | string,
  +isOptional: boolean,
  +maxLength: number,
  +name: string,
  // https://developer.yodlee.com/Data_Model/Resource_Provider#fieldType
  +type: 'checkbox' | 'radio' | 'image',
  +value: string,
  +valueEditable: 'true' | 'false',
|};

export type LoginField$TextOrPassword = {|
  +id: Long | string,
  +isOptional: boolean,
  +maxLength: number,
  +name: string,
  // https://developer.yodlee.com/Data_Model/Resource_Provider#fieldType
  +type: 'text' | 'password',
  +value: string,
  +valueEditable: 'true' | 'false',
|};

export type LoginField$Option = {|
  +id: Long | string,
  +isOptional: boolean,
  +name: string,
  +option: Array<LoginFieldOptionItem>
  +type: 'option',
  +value: string,
  +valueEditable: 'true' | 'false',
|};

export type LoginFieldOptionItem = {|
  +displayText: string,
  +isSelected: 'true' | 'false',
  +optionValue: string,
|};
