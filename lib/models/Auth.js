'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genLogin = genLogin;
exports.genLogout = genLogout;

var _config = require('../config');

/**
 * Login a user with the given email and password.
 */
function genLogin(email, password) {
  return (0, _config.getFirebase)().auth().signInWithEmailAndPassword(email, password);
}

/**
 * Logout the current user.
 */


function genLogout() {
  return (0, _config.getFirebase)().auth().signOut();
}