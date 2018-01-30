'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getYodleeCredentialsCollection = getYodleeCredentialsCollection;
exports.genFetchYodleeCredentials = genFetchYodleeCredentials;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * NOTE: THIS DATA IS HIGHLY SENSITIVE AND SHOULD NEVER BE SENT ACROSS ANY
 * NETWORK REQUEST. FOR INTERNAL USE ONLY.
 */

function getYodleeCredentialsCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('YodleeCredentials');
}

function genFetchYodleeCredentials(userID) {
  return getYodleeCredentialsCollection().doc(userID).get().then(doc => {
    (0, _invariant2.default)(doc.exists, 'Yodlee Credentials not found for user %s', userID);
    return doc.data();
  });
}