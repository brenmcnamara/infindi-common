'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genLogin = genLogin;
exports.genUserInfo = genUserInfo;
exports.genUserMetrics = genUserMetrics;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Login a user with the given email and password.
 */
function genLogin(email, password) {
  return _config2.default.getFirebase().auth().signInWithEmailAndPassword(email, password);
}

/**
 * Generate the user info of the logged in user. Null if no user is logged
 * in.
 */
function genUserInfo() {
  return Promise.resolve().then(() => {
    const { currentUser } = _config2.default.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return _config2.default.getFirebase().firestore().collection('UserInfo').doc(currentUser.uid).get();
  }).then(document => {
    return document.exists ? document.data() : null;
  });
}

/**
 * Generate the user metrics of the logged in user. Null if no user is logged
 * in.
 */
function genUserMetrics() {
  return Promise.resolve().then(() => {
    const { currentUser } = _config2.default.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return _config2.default.getFirebase().firestore().collection('UserMetrics').doc(currentUser.uid).get();
  }).then(document => {
    return document.exists ? document.data() : null;
  });
}