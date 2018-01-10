'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genUserMetrics = genUserMetrics;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generate the user metrics of the logged in user. Null if no user is logged
 * in.
 */


/**
 * Important metrics we keep track of for the user. These are used to provide
 * and gain more insight on the User's finances.
 */
function genUserMetrics() {
  return Promise.resolve().then(() => {
    const { currentUser } = _config2.default.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return _config2.default.getFirebase().firestore().collection('UserMetrics').doc(currentUser.uid).get();
  }).then(document => {
    return document && document.exists ? document.data() : null;
  });
}