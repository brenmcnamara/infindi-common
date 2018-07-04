'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.ModelMutator = exports.ModelFetcher = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _FindiError = require('../FindiError');

var _FindiError2 = _interopRequireDefault(_FindiError);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// eslint-disable-next-line flowtype/generic-spacing


// eslint-disable-next-line flowtype/generic-spacing
const BATCH_LIMIT = 100;

class ModelFetcher {

  constructor(Ctor) {
    this._Ctor = Ctor;
  }

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------


  gen(id) {
    return this.__firebaseCollection.doc(id).get().then(doc => doc.exists ? this._Ctor.fromRaw(doc.data()) : null);
  }

  genNullthrows(id) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const model = yield _this.gen(id);
      if (!model) {
        const { modelName } = _this.constructor;
        throw _FindiError2.default.fromRaw({
          errorCode: 'CORE / RESOURCE_NOT_FOUND',
          errorMessage: `Could not find ${modelName} with id ${id}`
        });
      }
      return model;
    })();
  }

  genExists(id) {
    return this.__firebaseCollection.doc(id).get().then(doc => doc.exists);
  }

  get __firebaseCollection() {
    return (0, _config.getFirebaseAdminOrClient)().firestore().collection(this.constructor.collectionName);
  }
}

exports.ModelFetcher = ModelFetcher;
class ModelMutator {

  constructor(Ctor) {
    this._Ctor = Ctor;
  }

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------


  genSet(model) {
    return this.__firebaseCollection.doc(model.id).set(model.toRaw());
  }

  genSetCollection(collection) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const db = (0, _config.getFirebaseAdminOrClient)().firestore();
      let batchCount = 0;
      let currentBatch = db.batch();
      const batches = [currentBatch];
      collection.forEach(function (model) {
        const ref = _this2.__firebaseCollection.doc(model.id);
        currentBatch.set(ref, model.toRaw());
        ++batchCount;
        if (batchCount > BATCH_LIMIT) {
          currentBatch = db.batch();
          batches.push(currentBatch);
          batchCount = 0;
        }
      });
      yield Promise.all(batches.map(function (b) {
        return b.commit();
      }));
    })();
  }

  genDelete(id) {
    return this.__firebaseCollection.doc(id).delete();
  }

  genDeleteCollection(collection) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const db = (0, _config.getFirebaseAdminOrClient)().firestore();
      let batchCount = 0;
      let currentBatch = db.batch();
      const batches = [currentBatch];
      collection.forEach(function (model) {
        const ref = _this3.__firebaseCollection.doc(model.id);
        currentBatch.delete(ref);
        ++batchCount;
        if (batchCount > BATCH_LIMIT) {
          currentBatch = db.batch();
          batches.push(currentBatch);
          batchCount = 0;
        }
      });

      yield Promise.all(batches.map(function (b) {
        return b.commit();
      }));
    })();
  }

  get __firebaseCollection() {
    return (0, _config.getFirebaseAdminOrClient)().firestore().collection(this.constructor.collectionName);
  }
}

exports.ModelMutator = ModelMutator;
class Model {

  // ---------------------------------------------------------------------------
  // MAY OVERRIDE
  // ---------------------------------------------------------------------------
  equals(that) {
    if (this === that) {
      return true;
    }

    const thisKeys = Object.keys(this.__raw);
    const thatKeys = Object.keys(that.__raw);
    if (thisKeys.length !== thatKeys.length) {
      return false;
    }

    return thisKeys.every(key => this.__raw[key] === that.__raw[key]);
  }

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------


  constructor(raw) {
    this.__raw = raw;
  }

  static fromRaw(raw) {
    const Ctor = this;
    return new Ctor(raw);
  }

  static get FirebaseCollectionUNSAFE() {
    return (0, _config.getFirebaseAdminOrClient)().firestore().collection(this.collectionName);
  }

  toRaw() {
    return this.__raw;
  }

  get id() {
    return this.__raw.id;
  }

  get updatedAt() {
    return this.__raw.updatedAt;
  }

  get createdAt() {
    return this.__raw.createdAt;
  }

  merge(props) {
    return this.constructor.fromRaw(_extends({}, this.__raw, props));
  }
}
exports.Model = Model;