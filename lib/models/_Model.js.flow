/* @flow */

import { getFirebaseAdminOrClient } from '../config';

import type { ID, ModelStub } from 'common/types/core';

export class ModelFetcher<TModelName: string, TRaw: ModelStub<TModelName>> {
  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  collectionName: string;
  modelName: TModelName;

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------
  gen(id: ID): Promise<Model<*, TRaw> | null> {
    return this.__firebaseCollection
      .doc(id)
      .get()
      .then(doc => (doc.exists() ? doc.data() : null));
  }

  get __firebaseCollection(): * {
    return getFirebaseAdminOrClient()
      .firestore()
      .collection(this.collectionName);
  }
}

export class ModelMutator<TModelName: string, TRaw: ModelStub<TModelName>> {
  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  collectionName: string;
  modelName: TModelName;

  // ---------------------------------------------------------------------------
  // DO NOT OVERRIDE
  // ---------------------------------------------------------------------------
  genSet(model: Model<*, TRaw>): Promise<void> {
    return this.__firebaseCollection
      .doc(model.id)
      .set(model);
  }

  get __firebaseCollection(): * {
    return getFirebaseAdminOrClient()
      .firestore()
      .collection(this.collectionName);
  }
}

export class Model<TModelName: string, TRawModel: ModelStub<TModelName>> {
  // ---------------------------------------------------------------------------
  // MUST OVERRIDE
  // ---------------------------------------------------------------------------
  static Fetcher: ModelFetcher<TModelName, *>;
  static Mutator: ModelMutator<TModelName, *>;

  collectionName: string;
  modelName: TModelName;

  // ---------------------------------------------------------------------------
  // MAY OVERRIDE
  // ---------------------------------------------------------------------------
  equals(that: Model<*, TRawModel>): boolean {
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
    return new this.constructor(raw);
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
    return new this.constructor({ ...this.__raw, ...props });
  }
}
