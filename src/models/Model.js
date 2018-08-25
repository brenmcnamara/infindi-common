/* @flow */

import FindiError from '../FindiError';
import Immutable from 'immutable';

import { createPointer } from '../db-utils';
import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub, Pointer } from '../../types/core';
import type { Map, OrderedMap } from 'immutable';

// eslint-disable-next-line flowtype/generic-spacing
export type ModelCollection<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
> = Map<ID, TModel>;

// eslint-disable-next-line flowtype/generic-spacing
export type ModelOrderedCollection<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
> = OrderedMap<ID, TModel>;

export type ModelQuery =
  | ModelCollectionQuery
  | ModelOrderedCollectionQuery
  | ModelSingleQuery;

export type ModelCollectionQuery = {|
  +handle: Object,
  +type: 'COLLECTION_QUERY',
|};

export type ModelOrderedCollectionQuery = {|
  +handle: Object,
  +type: 'ORDERED_COLLECTION_QUERY',
|};

export type ModelSingleQuery = {|
  +handle: Object,
  +type: 'SINGLE_QUERY',
|};

const BATCH_LIMIT = 100;

export class ModelFetcher<
  TModelName: string,
  TRaw: ModelStub<TModelName>,
  TModel: Model<TModelName, TRaw>,
  TCollection: ModelCollection<TModelName, TRaw, TModel>,
  TOrderedCollection: ModelOrderedCollection<TModelName, TRaw, TModel>,
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

  async genNullthrows(id: ID): Promise<TModel> {
    const model = await this.gen(id);
    if (!model) {
      const { modelName } = this.constructor;
      throw FindiError.fromRaw({
        errorCode: 'CORE / RESOURCE_NOT_FOUND',
        errorMessage: `Could not find ${modelName} with id ${id}`,
      });
    }
    return model;
  }

  async genSingleQuery(query: ModelSingleQuery): Promise<TModel | null> {
    // NOTE: Assuming firebase collection for now.
    const snapshot = await query.handle.get();
    const doc = snapshot.docs[0];
    return doc && doc.exists ? this._Ctor.fromRaw(doc.data()) : null;
  }

  async genCollectionQuery(query: ModelCollectionQuery): Promise<TCollection> {
    // NOTE: Assuming firebase collection for now.
    const snapshot = await query.handle.get();
    return Immutable.Map(
      snapshot.docs.map(doc => {
        const model: TModel = this._Ctor.fromRaw(doc.data());
        return [model.id, model];
      }),
    );
  }

  async genOrderedCollectionQuery(
    query: ModelOrderedCollectionQuery,
  ): Promise<TOrderedCollection> {
    // NOTE: Assuming firebase collection for now.
    const snapshot = await query.handle.get();
    return Immutable.OrderedMap(
      snapshot.docs.map(doc => {
        const model: TModel = this._Ctor.fromRaw(doc.data());
        return [model.id, model];
      }),
    );
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

  async genSetCollection<
    TCollection: ModelCollection<TModelName, TRaw, TModel>,
  >(collection: TCollection): Promise<void> {
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
        batchCount = 0;
      }
    });
    await Promise.all(batches.map(b => b.commit()));
  }

  genDelete(id: ID): Promise<void> {
    return this.__firebaseCollection.doc(id).delete();
  }

  async genDeleteCollection<
    TCollection: ModelCollection<TModelName, TRaw, TModel>,
  >(collection: TCollection) {
    const db = getFirebaseAdminOrClient().firestore();
    let batchCount = 0;
    let currentBatch = db.batch();
    const batches = [currentBatch];
    collection.forEach(model => {
      const ref = this.__firebaseCollection.doc(model.id);
      currentBatch.delete(ref);
      ++batchCount;
      if (batchCount > BATCH_LIMIT) {
        currentBatch = db.batch();
        batches.push(currentBatch);
        batchCount = 0;
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
    if (this === that || this.__raw === that.__raw) {
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

  static createPointer(id: ID): Pointer<TModelName> {
    return createPointer(this.constructor.modelName, id);
  }

  createPointer(): Pointer<TModelName> {
    return createPointer(this.constructor.modelName, this.id);
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
