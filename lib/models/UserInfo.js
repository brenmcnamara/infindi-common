'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genUserInfo = genUserInfo;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate the user info of the logged in user. Null if no user is logged
 * in.
 */


/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
function genUserInfo() {
  return Promise.resolve().then(() => {
    const { currentUser } = _config2.default.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return _config2.default.getFirebase().firestore().collection('UserInfo').doc(currentUser.uid).get();
  }).then(document => {
    return document && document.exists ? document.data() : null;
  });
}