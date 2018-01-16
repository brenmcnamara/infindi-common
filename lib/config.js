'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = initialize;
exports.initializeAsAdmin = initializeAsAdmin;
exports.getFirebase = getFirebase;
exports.getFirebaseAdmin = getFirebaseAdmin;
exports.getFirebaseAdminOrClient = getFirebaseAdminOrClient;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _isInitialized = false;

let _Firebase = null;
let _FirebaseAdmin = null;

function initialize(Firebase) {
  (0, _invariant2.default)(!_isInitialized, 'Trying to initialize common more than once');
  _isInitialized = true;
  _Firebase = Firebase;
}

function initializeAsAdmin(FirebaseAdmin) {
  (0, _invariant2.default)(!_isInitialized, 'Trying to initialize common more than once');
  _isInitialized = true;
  _FirebaseAdmin = FirebaseAdmin;
}

function getFirebase() {
  (0, _invariant2.default)(_isInitialized && _Firebase, 'Expected config to be initialized');
  return _Firebase;
}

function getFirebaseAdmin() {
  (0, _invariant2.default)(_isInitialized && _FirebaseAdmin, 'Expected config to be initialized in admin mode');
  return _FirebaseAdmin;
}

function getFirebaseAdminOrClient() {
  (0, _invariant2.default)(_isInitialized && (_Firebase || _FirebaseAdmin), 'Either firebase or firebase admin needs to be configured');
  // $FlowFixMe - Cannot be null
  return _FirebaseAdmin || _Firebase;
}