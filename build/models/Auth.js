'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genLogin = genLogin;
exports.genLogout = genLogout;

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
 * Logout the current user.
 */


function genLogout() {
  return _config2.default.getFirebase().auth().signOut();
}