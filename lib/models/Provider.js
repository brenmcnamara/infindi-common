'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _Model = require('./_Model');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

class Provider extends _Model.Model {

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static create(sourceOfTruth, quirks) {
    const raw = _extends({}, (0, _dbUtils.createModelStub)('Provider'), {
      id: calculateIDFromSourceOfTruth(sourceOfTruth),
      isDeprecated: false,
      quirkCount: quirks.length,
      quirks,
      sourceOfTruth
    });
    return Provider.fromRaw(raw);
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  get isDeprecated() {
    return this.__raw.isDeprecated;
  }

  get quirkCount() {
    return this.__raw.quirkCount;
  }

  get quirks() {
    return this.__raw.quirks;
  }

  get sourceOfTruth() {
    return this.__raw.sourceOfTruth;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------
  get name() {
    (0, _invariant2.default)(this.sourceOfTruth.type === 'YODLEE', 'Expecting provider to come from YODLEE');
    return this.sourceOfTruth.value.name;
  }

  get sourceOfTruthID() {
    switch (this.sourceOfTruth.type) {
      case 'YODLEE':
        {
          return String(this.sourceOfTruth.value.id);
        }

      default:
        (0, _invariant2.default)(false, 'Unrecognized sourceOfTruth: %s', this.sourceOfTruth.type);
    }
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
}

exports.default = Provider; // -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

Provider.collectionName = 'Providers';
Provider.modelName = 'Provider';
function calculateIDFromSourceOfTruth(sourceOfTruth) {
  switch (sourceOfTruth.type) {
    case 'YODLEE':
      {
        return String(sourceOfTruth.value.id);
      }

    default:
      (0, _invariant2.default)(false, 'Unrecognized sourceOfTruth: %s', sourceOfTruth.type);
  }
}