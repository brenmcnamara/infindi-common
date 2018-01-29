'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createModelStub = createModelStub;
exports.updateModelStub = updateModelStub;
exports.createPointer = createPointer;

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the core properties of a model stub. Properties then must be added
 * to the stub to get a full model.
 */
function createModelStub(name) {
  const now = new Date();
  return {
    createdAt: now,
    id: (0, _v2.default)(),
    modelType: name,
    type: 'MODEL',
    updatedAt: now
  };
}

/**
 * Update an existing model's modelStub properties. The caller is responsible
 * for updating the properties specific to the model itself.
 */
function updateModelStub(model) {
  const now = new Date();
  return _extends({}, model, {
    updatedAt: now
  });
}

function createPointer(pointerType, refID) {
  return {
    pointerType,
    type: 'POINTER',
    refID
  };
}