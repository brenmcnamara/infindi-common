'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getAccountsCollection = getAccountsCollection;
exports.createAccountFromYodleeAccount = createAccountFromYodleeAccount;
exports.genFetchAccount = genFetchAccount;
exports.genCreateAccount = genCreateAccount;
exports.genUpdateAccount = genUpdateAccount;
exports.genUpsertAccountFromYodleeAccount = genUpsertAccountFromYodleeAccount;
exports.getAccountName = getAccountName;
exports.getBalance = getBalance;
exports.getAccountType = getAccountType;
exports.getGroupType = getGroupType;
exports.getInstitution = getInstitution;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getAccountsCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('Accounts');
}

function createAccountFromYodleeAccount(yodleeAccount, userID, isTestAccount = false) {
  return _extends({}, (0, _dbUtils.createModelStub)('Account'), {
    canDisplay: calculateCanDisplay(yodleeAccount),
    isTestAccount,
    sourceOfTruth: {
      type: 'YODLEE',
      value: yodleeAccount
    },
    userRef: (0, _dbUtils.createPointer)('User', userID)
  });
}

function genFetchAccount(accountID) {
  return getAccountsCollection().doc(accountID).get().then(doc => doc.exists ? doc.data() : null);
}

function genCreateAccount(account) {
  return getAccountsCollection().doc(account.id).set(account);
}

function genUpdateAccount(account) {
  return getAccountsCollection().doc(account.id).update(account);
}

function genUpsertAccountFromYodleeAccount(yodleeAccount, userID) {
  return getAccountsCollection().where('sourceOfTruth.type', '==', 'YODLEE').where('sourceOfTruth.value.id', '==', yodleeAccount.id).get().then(snapshot => {
    const account = snapshot.docs.length > 0 && snapshot.docs[0].exists ? snapshot.docs[0].data() : null;
    if (!account) {
      // No account. Create a new one.
      const account = createAccountFromYodleeAccount(yodleeAccount, userID);
      return genCreateAccount(account);
    }
    // Update the existing account.
    const now = new Date();
    const updateAccount = _extends({}, account, {
      canDisplay: calculateCanDisplay(yodleeAccount),
      updatedAt: now,
      sourceOfTruth: { type: 'YODLEE', value: yodleeAccount }
    });
    return genUpdateAccount(updateAccount);
  });
}

function getAccountName(account) {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        const raw = sourceOfTruth.value.accountName;
        return raw.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      }

    default:
      return (0, _invariant2.default)(false, 'Unrecognized account sourceOfTruth.type %s', sourceOfTruth.type);
  }
}

function getBalance(account) {
  const { sourceOfTruth } = account;
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        const { balance } = sourceOfTruth.value;
        if (!balance) {
          return 0;
        }

        const groupType = getGroupType(account);
        return groupType === 'SHORT_TERM_DEBT' ? -balance.amount : balance.amount;
      }

    default:
      {
        return (0, _invariant2.default)(false, 'Unrecognized account sourceOfTruth.type %s', sourceOfTruth.type);
      }
  }
}

function getAccountType(account) {
  const { sourceOfTruth } = account;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'getAccountType only works for YODLEE accounts');
  return sourceOfTruth.value.accountType;
}

function getGroupType(account) {
  const { sourceOfTruth } = account;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'getGroupType only works for YODLEE accounts');
  const container = sourceOfTruth.value.CONTAINER;
  const accountType = sourceOfTruth.value.accountType;

  if (container === 'creditCard' || container === 'bill') {
    return 'CREDIT_CARD_DEBT';
  } else if (container === 'loan' && accountType === 'OTHER') {
    return 'DEBT';
  } else if (container === 'rewards') {
    return 'REWARDS';
  }

  switch (accountType) {
    case 'CHECKING':
    case 'FSA':
    case 'PREPAID':
    case 'SAVINGS':
      return 'AVAILABLE_CASH';

    case 'BROKERAGE_CASH':
    case 'BROKERAGE_CASH_OPTION':
    case 'CASH_ISA':
    case 'CD':
    case 'CMA':
    case 'INDIVIDUAL_SAVINGS_ACCOUNT_ISA':
    case 'MONEY_MARKET':
    case 'MONEY_MARKET_ACCOUNT':
    case 'PRECIOUS_METAL_ACCOUNT':
    case 'TAX_FREE_SAVINGS_ACCOUNT':
      return 'LIQUID_INVESTMENTS';

    case '529_PLAN':
    case 'ADMINISTRATOR':
    case 'ANNUITIZED_ANNUITY':
    case 'ANNUITY':
    case 'BROKERAGE_LINK_ACCOUNT':
    case 'CHARITABLE_REMAINDER':
    case 'CHARITABLE_REMAINDER_TRUST':
    case 'CHARITABLE_LEAD':
    case 'CHARITABLE_LEAD_TRUST':
    case 'COMMUNITY_PROPERTY':
    case 'CONVERVATOR':
    case 'CONSERVATORSHIP':
    case 'CORPORATE':
    case 'CORPORATE_INVESTMENT_ACCOUNT':
    case 'CUSTODIAL':
    case 'CUSTODIAL_ACCOUNT':
    case 'COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA':
    case 'DEFERRED_PROFIT_SHARING_PLAN':
    case 'DEFERRED_PROFIT_SHARING_PLAN_DPSP':
    case 'EDUCATIONAL':
    case 'EDUCATIONAL_SAVINGS_PLAN_529':
    case 'EMPLOYEE_BENEFIT_TRUST':
    case 'EMPLOYEE_STOCK_OPTION_PLAN':
    case 'EMPLOYEE_STOCK_PURCHASE_PLAN':
    case 'EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP':
    case 'ESOPP':
    case 'GRANTOR_RETAINED_INCOME_TRUST':
    case 'HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA':
    case 'HEALTH_SAVINGS_ACCOUNT_HSA':
    case 'HSA':
    case 'GRANTOR_RETAINED_ANNUITY_TRUST_GRAT':
    case 'GUARANTEED_INVESTMENT_CERTIFICATES':
    case 'GUARANTEED_INVESTMENT_CERTIFICATES_GIC':
    case 'INDEXED_ANNUITY':
    case 'INDIVIDUAL':
    case 'INNOVATIVE_FINANCE_ISA':
    case 'INTERNATIONAL_TRUST':
    case 'INVESTMENT_CLUB':
    case 'INVESTMENT_LOAN_ACCOUNT':
    case 'IRREVOCABLE_LIFE_INSURANCE_TRUST':
    case 'IRREVOCABLE_TRUST':
    case 'JOINT_BY_ENTIRETY':
    case 'JOINT_TENANTS_COMMUNITY_PROPERTY':
    case 'JOINT_TENANTS_TENANCY_IN_COMMON_JTIC':
    case 'JOINT_TENANTS_TENANTS_BY_ENTIRETY':
    case 'JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JWTROS':
    case 'JTTIC':
    case 'JTWROS':
    case 'JUNIOR_ISA':
    case 'LIFE_INTEREST_TRUST':
    case 'LIVING_TRUST':
    case 'OFFSHORE_TRUST':
    case 'PERFORMANCE_PLAN':
    case 'REAL_ESTATE':
    case 'REGISTERED_DISABILITY_SAVINGS_PLAN':
    case 'REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP':
    case 'REGISTERED_EDUCATION_SAVINGS_PLAN':
    case 'REGISTERED_EDUCATION_SAVINGS_PLAN_RESP':
    case 'RESTRICTED_STOCK_AWARD':
    case 'REVOCABLE_TRUST':
    case 'SIMPLE':
    case 'SOLE_PROPRIETORSHIP':
    case 'STOCKS_AND_SHARES_ISA':
    case 'STOCK_BASKET':
    case 'STOCK_BASKET_ACCOUNT':
    case 'SUPER_ANNUATION':
    case 'SUPERANNUATION':
    case 'TESTAMENTARY_TRUST':
    case 'TRUST':
    case 'UGMA':
    case 'UNIFORM_GIFT_TO_MINORS_ACT_UGMA':
    case 'UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA':
    case 'UTMA':
    case 'VARIABLE_ANNUITY':
      return 'NON_LIQUID_INVESTMENTS';

    case '401A':
    case '401K':
    case '403B':
    case '457_DEFERRED_COMPENSATION':
    case 'DEFERRED_COMPENSATION_PLAN_457':
    case 'EMPLOYEES_PENSION_SCHEME_EPS':
    case 'EMPLOYEE_RETIREMENT_ACCOUNT_401K':
    case 'EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K':
    case 'EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B':
    case 'GROUP_RETIREMENT_SAVINGS_PLAN':
    case 'GROUP_RETIREMENT_SAVINGS_PLAN_GRSP':
    case 'INDIVIDUAL_RETIREMENT_ACCOUNT_IRA':
    case 'IRA':
    case 'LOCKED_IN_RETIREMENT_ACCOUNT':
    case 'LOCKED_IN_RETIREMENT_ACCOUNT_LIRA':
    case 'LOCKED_IN_RETIREMENT_SAVINGS_PLAN':
    case 'LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP':
    case 'MONEY_PURCHASE_RETIREMENT_PLAN_401A':
    case 'MPP':
    case 'NATIONAL_PENSION_SYSTEM_NPS':
    case 'NON_REGISTERED_SAVINGS_PLAN_NRSP':
    case 'NON_REGISTERED_SAVINGS_PLAN':
    case 'PENSION_PLAN':
    case 'PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND':
    case 'PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF':
    case 'PROFIT_SHARING_PLAN':
    case 'PSP':
    case 'REGISTERED_PENSION_PLAN':
    case 'REGISTERED_PENSION_PLAN_RPP':
    case 'REGISTERED_RETIREMENT_INCOME_FUND':
    case 'REGISTERED_RETIREMENT_INCOME_FUND_RIF':
    case 'REGISTERED_RETIREMENT_SAVINGS_PLAN':
    case 'REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP':
    case 'ROLLOVER':
    case 'ROLLOVER_IRA':
    case 'ROTH':
    case 'ROTH_403B':
    case 'ROTH_CONVERSION':
    case 'ROTH_IRA':
    case 'SEP':
    case 'SEP_IRA':
    case 'SARSEP_IRA':
    case 'SIMPLE_IRA':
    case 'SPOUSAL_RETIREMENT_INCOME_FUND':
    case 'SPOUSAL_RETIREMENT_INCOME_FUND_SRIF':
    case 'SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP':
    case 'SPOUSAL_ROTH_IRA':
    case 'SPOUSAL_IRA':
    case 'SPOUSAL_RETIREMENT_SAVINGS_PLAN':
    case 'SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP':
      return 'RETIREMENT';

    case 'BROKERAGE_MARGIN':
    case 'BROKERAGE_MARGIN_OPTION':
    case 'HOME_EQUITY_LINE_OF_CREDIT':
    case 'LINE_OF_CREDIT':
      return 'CREDIT_CARD_DEBT';

    case 'AUTO_LOAN':
    case 'HOME_LOAN':
    case 'INSTALLMENT_LOAN':
    case 'MORTGAGE':
    case 'PERSONAL_LOAN':
    case 'STUDENT_LOAN':
      return 'DEBT';

    case 'CHARITABLE_GIFT_ACCOUNT':
    case 'CHURCH':
    case 'CHURCH_ACCOUNT':
      return 'CHARITY';

    default:
      return 'OTHER';
  }
}

function getInstitution(account) {
  const { sourceOfTruth } = account;
  (0, _invariant2.default)(sourceOfTruth.type === 'YODLEE', 'getInstitution only supports accounts of type YODLEE');
  return sourceOfTruth.value.providerName.toUpperCase();
}

function calculateCanDisplay(yodleeAccount) {
  return Boolean(yodleeAccount.accountType !== 'REWARD_POINTS' && yodleeAccount.balance);
}