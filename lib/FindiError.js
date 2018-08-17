'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
class FindiError {

  constructor(raw) {
    this._raw = raw;
  }

  static fromRaw(raw) {
    return new FindiError(raw);
  }

  // https://firebase.google.com/docs/reference/js/firebase.auth.Error
  static fromFirebaseError(error) {
    let errorCode;
    switch (error.code) {
      case 'auth/app-deleted':
      case 'auth/invalid-api-key':
        errorCode = 'CORE / CRITIAL_ERROR_REQUIRES_IMMEDIATE_ADMIN_ATTENTION';
        break;

      case 'auth/app-not-authorized':
      case 'auth/invalid-user-token':
      case 'auth/requires-recent-login':
      case 'auth/unauthorized-domain':
      case 'auth/user-disabled':
      case 'auth/user-token-expired':
        errorCode = 'CORE / PERMISSION_DENIED';
        break;

      case 'auth/argument-error':
      case 'auth/operation-not-allowed':
      case 'auth/web-storage-unsupported':
        errorCode = 'CORE / INCORRECT_EXTERNAL_SERVICE_CALL';
        break;

      case 'auth/network-request-failed':
        errorCode = 'CORE / NETWORK_ERROR';
        break;

      case 'auth/too-many-requests':
        errorCode = 'CORE / EXTERNAL_SERVICE_DENIED';
        break;

      default:
        errorCode = 'CORE / EXTERNAL_SERVICE_ERROR';
        break;
    }

    return FindiError.fromRaw({
      errorCode,
      errorMessage: `{FIREBASE} ${error.message}`
    });
  }

  // https://developer.yodlee.com/FAQs/Error_Codes
  // TODO: Implement this correctly.
  static fromYodleeError(yodleeError) {
    let errorCode;
    switch (yodleeError.errorCode) {
      default:
        errorCode = 'CORE / EXTERNAL_SERVICE_ERROR';
        break;
    }

    return FindiError.fromRaw({
      errorCode,
      errorMessage: `{YODLEE} ${yodleeError.errorMessage}`
    });
  }

  static fromUnknownEntity(entity) {
    if (!entity || typeof entity !== 'object') {
      return this.fromRaw({
        errorCode: 'CORE / UNKNOWN_ERROR',
        errorMessage: 'An unknown error was encountered'
      });
    }

    if (entity instanceof FindiError) {
      return entity;
    }

    if (isMaybeInvariantViolation(entity)) {
      return this.fromRaw({
        errorCode: 'CORE / ASSERTION_FAILURE',
        errorMessage: entity.toString()
      });
    }

    if (entity instanceof Error) {
      return this.fromRaw({
        errorCode: 'CORE / LOGICAL_ERROR',
        errorMessage: entity.toString(),
        errorStack: entity.stack
      });
    }

    if (isMaybeFirebaseError(entity)) {
      return this.fromFirebaseError(entity);
    }

    if (isMaybeYodleeError(entity)) {
      return this.fromYodleeError(entity);
    }

    // I have no idea what error this is...
    return this.fromRaw({
      errorCode: 'CORE / UNKNOWN_ERROR',
      errorMessage: typeof entity.toString === 'function' ? entity.toString() : 'An unknown error was encountered'
    });
  }

  get errorCode() {
    return this._raw.errorCode;
  }

  get errorMessage() {
    return this._raw.errorMessage;
  }

  get errorStack() {
    return this._raw.errorStack;
  }

  toRaw() {
    return this._raw;
  }

  toString() {
    return `[${this.errorCode}]: ${this.errorMessage}`;
  }
}

exports.default = FindiError; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function isMaybeInvariantViolation(error) {
  return typeof error.toString === 'function' && error.toString().startsWith('Invariant Violation:');
}

function isMaybeFirebaseError(error) {
  return typeof error.code === 'string' && typeof error.message === 'string';
}

function isMaybeYodleeError(error) {
  return typeof error.errorCode === 'string' && typeof error.errorMessage === 'string' && !(error instanceof FindiError);
}