'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let _isInitialized = false;
let _Firebase = null;

function initialize(Firebase) {
  _isInitialized = true;
  _Firebase = Firebase;
}

function getFirebase() {
  (0, _invariant2.default)(_isInitialized && _Firebase, 'Expected config to be initialized');
  return _Firebase;
}

exports.default = {
  getFirebase,
  initialize
};