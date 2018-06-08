/* @flow */

import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub } from '../../types/core';
import type { Map } from 'immutable';

// eslint-disable-next-line flowtype/generic-spacing
type ModelCollection<TModelName: string, TRaw: ModelStub<TModelName>> = Map<
  ID,
  Model<TModelName, TRaw>,
>;

const BATCH_LIMIT = 100;

export class ModelFetcher<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
> {
  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  static collectionName: string;
  static modelName: TModelName;

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------
  _Ctor: Class<TModel>;

  constructor(Ctor: Class<TModel>) {
    this._Ctor = Ctor;
  }

  gen(id: ID): Promise<TModel | null> {
    return this.__firebaseCollection
      .doc(id)
      .get()
      .then(doc => (doc.exists ? this._Ctor.fromRaw(doc.data()) : null));
  }

  genExists(id: ID): Promise<boolean> {
    return this.__firebaseCollection
      .doc(id)
      .get()
      .then(doc => doc.exists);
  }

  get __firebaseCollection(): * {
    return getFirebaseAdminOrClient()
      .firestore()
      .collection(this.constructor.collectionName);
  }
}

export class ModelMutator<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
> {
  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  static collectionName: string;
  static modelName: TModelName;

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------
  _Ctor: Class<TModel>;

  constructor(Ctor: Class<TModel>) {
    this._Ctor = Ctor;
  }

  genSet(model: TModel): Promise<void> {
    return this.__firebaseCollection.doc(model.id).set(model.toRaw());
  }

  genDelete(id: ID): Promise<void> {
    return this.__firebaseCollection.doc(id).delete();
  }

  async genSetCollection(
    collection: ModelCollection<TModelName, TRaw>,
  ): Promise<void> {
    const db = getFirebaseAdminOrClient().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    collection.forEach(model => {
      const ref = this.__firebaseCollection.doc(model.id);
      currentBatch.set(ref, model.toRaw());
      ++batchCount;
      if (batchCount > BATCH_LIMIT) {
        currentBatch = db.batch();
        batches.push(currentBatch);
      }
    });
    await Promise.all(batches.map(b => b.commit()));
  }

  get __firebaseCollection(): * {
    return getFirebaseAdminOrClient()
      .firestore()
      .collection(this.constructor.collectionName);
  }
}

export class Model<TModelName: string, TRawModel: ModelStub<TModelName>> {
  static collectionName: string;
  static modelName: TModelName;

  // ---------------------------------------------------------------------------
  // MAY OVERRIDE
  // ---------------------------------------------------------------------------
  equals(that: Model<TModelName, TRawModel>): boolean {
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
  __raw: TRawModel;

  constructor(raw: TRawModel) {
    this.__raw = raw;
  }

  static fromRaw(raw: TRawModel): this {
    const Ctor = this;
    return new Ctor(raw);
  }

  static get FirebaseCollectionUNSAFE(): * {
    return getFirebaseAdminOrClient()
      .firestore()
      .collection(this.collectionName);
  }

  toRaw(): TRawModel {
    return this.__raw;
  }

  get id(): ID {
    return this.__raw.id;
  }

  get updatedAt(): Date {
    return this.__raw.updatedAt;
  }

  get createdAt(): Date {
    return this.__raw.createdAt;
  }

  merge(props: $Shape<TRawModel>): this {
    return this.constructor.fromRaw({ ...this.__raw, ...props });
  }
}
