'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = exports.ModelMutator = exports.ModelFetcher = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('../config');

class ModelFetcher {

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  gen(id) {
    return this.__firebaseCollection.doc(id).get().then(doc => doc.exists() ? doc.data() : null);
  }

  get __firebaseCollection() {
    return (0, _config.getFirebaseAdminOrClient)().firestore().collection(this.collectionName);
  }
}

exports.ModelFetcher = ModelFetcher;
class ModelMutator {

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  genSet(model) {
    return this.__firebaseCollection.doc(model.id).set(model);
  }

  get __firebaseCollection() {
    return (0, _config.getFirebaseAdminOrClient)().firestore().collection(this.collectionName);
  }
}

exports.ModelMutator = ModelMutator;
class Model {

  // ---------------------------------------------------------------------------
  // MAY OVERRIDE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
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
    return new this.constructor(raw);
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
    return new this.constructor(_extends({}, this.__raw, props));
  }
}
exports.Model = Model;