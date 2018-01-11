'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genFetchUserMetric = genFetchUserMetric;

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _QueryBuilder = require('./_QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Important metrics we keep track of for the user. These are used to provide
 * and gain more insight on the User's finances.
 */
function genFetchUserMetric() {
  return Promise.resolve().then(() => {
    const { currentUser } = _config2.default.getFirebase().auth();
    if (!currentUser) {
      return null;
    }
    return _QueryBuilder2.default.SingleDoc.fetch('UserMetrics')(currentUser.uid);
  });
}