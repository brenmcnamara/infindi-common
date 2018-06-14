/* @flow */

import type { ID } from './core';
import type { OrderedMap } from 'immutable';

// TODO: ON ACCOUNT "faceAmount"

// -----------------------------------------------------------------------------
//
// UTILITY TYPES
//
// -----------------------------------------------------------------------------

export type Long = number;

export type Date = string;

export type DateTime = string;

export type Money = {|
  +amount: number,
  +currency: string,
|};

export type Merchant = {|
  +address: Address,
  +categoryLabel: string,
  +id: string,
  +name: string,
  +source: string,
|};

export type BankTransferCode = Object;

export type Address = Object;

// -----------------------------------------------------------------------------
//
// PROFILE
//
// -----------------------------------------------------------------------------

export type Profile = Object;

// -----------------------------------------------------------------------------
//
// PROVIDER
//
// -----------------------------------------------------------------------------

export type Provider = {|
  +authType: string,
  +baseURL: string,
  +countryISOCode: string,
  +dataset: Dataset,
  +help: string,
  +id: Long,
  +isAddedByUser: boolean,
  +isAutoRefreshEnabled: boolean,
  +isProviderOwned: boolean,
  +languageISOCode: string,
  +lastModified: DateTime,
  +loginForm: LoginForm,
  +loginURL: string,
  +logo: string,
  +numberOfTransactionDays: number,
  +oAuthSite: string | boolean,
  +primaryLanguageISOCode: string,
  +Priority: string,
  +favicon: string,
  +name: string,
  +status: string,
|};

export type ProviderOrderedCollection = OrderedMap<ID, Provider>;

// -----------------------------------------------------------------------------
//
// PROVIDER ACCOUNT
//
// -----------------------------------------------------------------------------

export type ProviderAccount = {|
  +createdDate: Date,
  +dataset: Dataset,
  +aggregationSource: string,
  +id: Long,
  +isManual: boolean,
  +loginForm: LoginForm,
  +providerId: Long,
  +profile: Profile,
  +requestId: Long,
  +status: string,
|};

// -----------------------------------------------------------------------------
//
// ACCOUNT
//
// -----------------------------------------------------------------------------

export type Account =
  | Account$Bank
  | Account$Bill
  | Account$CreditCard
  | Account$Insurance
  | Account$Investment
  | Account$Loan
  | Account$Reward;

export type Account$Bank = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +amountPercentageYield: number,
  +availableBalance: Money,
  +balance: Money,
  +bankTransferCaode: BankTransferCode,
  +classification: AccountClassification,
  +container: 'bank',
  +currentBalance: Money,
  +fullAccountNumber: string,
  +isAsset: boolean,
|};

export type Account$CreditCard = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +amountDue: Money,
  +apr: number,
  +availableCash: Money,
  +availableCredit: Money,
  +balance: Money,
  +classification: AccountClassification,
  +container: 'creditCard',
  +dueDate: Date,
  +isAsset: number,
|};

export type Account$Insurance = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +amountDue: Money,
  +annuityBalance: Money,
  +balance: Money,
  +cashValue: Money,
  +classification: AccountClassification,
  +container: 'insurance',
  +deathBenefit: Money,
  +dueDate: Date,
  +expirationDate: Date,
  +isAsset: boolean,
  +premium: Money,
  +policyEffectiveDate: Date,
  +policyFromDate: Date,
  +policyStatus: string,
  +policyTerm: InsurancePolicyTerm,
  +policyToDate: Date,
  +remainingBalance: Money,
|};

export type Account$Investment = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +annuityBalance: Money,
  +availableLoan: Money,
  +balance: Money,
  +cash: Money,
  +container: 'investment',
  +classification: AccountClassification,
  +isAsset: boolean,
|};

export type Account$Loan = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +amountDue: Money,
  +availableCredit: Money,
  +balance: Money,
  +classification: AccountClassification,
  +collateral: Money,
  +container: 'loan',
  +dueDate: Date,
  +interestPaidLastYear: Money,
  +interestPaidYTD: Money,
  +interestRateType: 'UNKNOWN' | 'OTHER' | 'FIXED' | 'VARIABLE',
  +isAsset: boolean,
|};

export type Account$Bill = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +amountDue: Money,
  +balance: Money,
  +classification: AccountClassification,
  +container: 'bill',
  +dueDate: Date,
  +isAsset: boolean,
|};

export type Account$Reward = {|
  +accountName: string,
  +accountNumber: string,
  +aggregationSource: string,
  +classification: AccountClassification,
  +container: 'reward',
  +isAsset: boolean,
|};

export type AccountClassification =
  | 'CORPORATE'
  | 'OTHER'
  | 'PERSONAL'
  | 'SMALL_BUSINESS'
  | 'TRUST'
  | 'VIRTUAL_CARD'
  | 'ADD_ON_CARD';

export type InsurancePolicyTerm = Object;

// -----------------------------------------------------------------------------
//
// TRANSACTION
//
// -----------------------------------------------------------------------------

export type Transaction =
  | Transaction$Bank
  | Transaction$Bill
  | Transaction$CreditCard
  | Transaction$Insurance
  | Transaction$Investment
  | Transaction$Loan
  | Transaction$Reward;

export type Transaction$Bank = {|
  +accountId: Long,
  +amount: Money,
  +baseType: 'CREDIT' | 'DEBIT',
  +checkNumber?: string,
  +container: 'bank',
  +date: Date,
  +description: TransactionDescription,
  +id: Long,
  +isManual: boolean,
  +merchant: Merchant,
  +parentCategoryId: Long,
  +postDate: Date,
  +runningBalance: Money,
  +status: TransactionStatus,
  +subtype: string,
  +transactionDate: Date,
  +type: string,
|};

export type Transaction$CreditCard = {|
  +accountId: Long,
  +amount: Money,
  +baseType: 'CREDIT' | 'DEBIT',
  +categoryType: string,
  +container: 'creditCard',
  +date: Date,
  +description: TransactionDescription,
  +id: Long,
  +isManual: boolean,
  +merchant: Merchant,
  +parentCategoryId: Long,
  +postDate: Date,
  +runningBalance: Money,
  +status: TransactionStatus,
  +subtype: string,
  +transactionDate: Date,
  +type: string,
|};

export type Transaction$Investment = {|
  +accountId: Long,
  +amount: Money,
  +baseType: 'CREDIT' | 'DEBIT',
  +categoryId: Long,
  +categorySource: string,
  +categoryType: string,
  +commision?: Money,
  +container: 'investment',
  +cusipNumber: string,
  +description: TransactionDescription,
  +date: Date,
  +highLevelCategoryId: Long,
  +holdingDescription: string,
  +id: Long,
  +isManual: boolean,
  +merchant: Merchant,
  +parentCategoryId: Long,
  +price: Money,
  +quantity: number,
  +runningBalance: Money,
  +settleDate: Date,
  +status: TransactionStatus,
  +symbol: string,
  +transactionDate: Date,
  +type: string,
|};

export type Transaction$Insurance = {|
  +accountId: Long,
  +amount: Money,
  +baseType: 'CREDIT' | 'DEBIT',
  +categoryId: string,
  +categorySource: string,
  +categoryType: string,
  +container: 'insurance',
  +date: Date,
  +description: TransactionDescription,
  +highLevelCategoryId: Long,
  +id: Long,
  +isManual: boolean,
  +merchant: Merchant,
  +parentCategoryId: Long,
  +postDate: Date,
  +status: TransactionStatus,
  +transactionDate: Date,
|};

export type Transaction$Loan = {|
  +accountId: Long,
  +amount: Money,
  +baseType: 'CREDIT' | 'DEBIT',
  +categoryId: Long,
  +categorySource: string,
  +categoryType: string,
  +container: 'loan',
  +date: Date,
  +description: TransactionDescription,
  +highLevelCategoryId: Long,
  +id: Long,
  +interest: Money,
  +isManual: boolean,
  +merchant: Merchant,
  +parentCategoryId: Long,
  +postDate: Date,
  +principal: Money,
  +status: TransactionStatus,
  +transactionDate: Date,
|};

export type Transaction$Reward = {|
  +container: 'reward',
|};

export type Transaction$Bill = {|
  +container: 'bill',
|};

export type TransactionStatus = 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED';

export type TransactionDescription = {|
  +consumer: string,
  +original: string,
  +simple?: string, // Only for bank and creditCard container
|};

// -----------------------------------------------------------------------------
//
// DATASET
//
// -----------------------------------------------------------------------------

export type Dataset = {|
  +attribute: Array<DatasetAttribute>,
  +name: string,
|};

export type DatasetAttribute = {|
  +container: string,
  +name: string,
|};

// -----------------------------------------------------------------------------
//
// LOGIN FORM
//
// -----------------------------------------------------------------------------

export type LoginForm = {|
  +forgotPasswordURL: string,
  +formType: string,
  +help: string,
  +id: Long,
  +mfaInfoText: string,
  +mfaInoTitle: string,
  +mfaTimeout: Long,
  +row: Array<LoginFormRow>,
|};

export type LoginFormRow = {|
  +field: Array<LoginFormField>,
  +fieldRowChoice: string,
  +form: string,
  +id: Long,
  +label: string,
|};

export type LoginFormField = {|
  +id: Long,
  +isOptional: boolean,
  +maxLength: number,
  +name: string,
  +option: Array<LoginFormOption>,
  +prefix: string,
  +suffix: string,
  +type: string,
  +validation: Array<LoginFormValidation>,
  +value: string,
  +valueEditable: boolean,
|};

export type LoginFormOption = {|
  +displayText: string,
  +isSelected: boolean,
  +optionValue: string,
|};

export type LoginFormValidation = {|
  +errorMsg: string,
  +regExp: string,
|};
