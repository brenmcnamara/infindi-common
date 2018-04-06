'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genFetchUserInfo = undefined;

let genFetchUserInfo = exports.genFetchUserInfo = (() => {
  var _ref = _asyncToGenerator(function* (id) {
    const doc = yield getUserInfoCollection().doc(id).get();
    return doc.exists ? doc.data() : null;
  });

  return function genFetchUserInfo(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.getUserInfoCollection = getUserInfoCollection;

var _config = require('../config');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Firebase has a pre-defined User type, which is a bare-bones model containing
 * some basic information for authentication purposes. The 'UserInfo' Object
 * contains other, relevant informtion about a User that we care about.
 * This has a 1:1 relationship between a firebase User and shares the same
 * id.
 */
function getUserInfoCollection() {
  return (0, _config.getFirebaseAdminOrClient)().firestore().collection('UserInfo');
}