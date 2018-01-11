/* @flow */

import Config from '../config';

import type { ID, ModelStub } from '../../types/core';

function singleDocFetch<TName: string, TModel: ModelStub<TName>>(
  collectionName: string,
): ID => Promise<TModel | null> {
  return (id: ID) =>
    Config.getFirebase()
      .firestore()
      .collection(collectionName)
      .doc(id)
      .get()
      .then(doc => (doc.exists ? doc.data() : null));
}

function singleDocCreate<TName: string, TModel: ModelStub<TName>>(
  collectionName: string,
): TModel => Promise<void> {
  return (model: TModel) =>
    Config.getFirebase()
      .firestore()
      .collection(collectionName)
      .doc(model.id)
      .set(model);
}

function singleDocUpdate<TName: string, TModel: ModelStub<TName>>(
  collectionName: string,
): TModel => Promise<void> {
  return (model: TModel) => {
    return Config.getFirebase()
      .firestore()
      .collection(collectionName)
      .doc(model.id)
      .update(model);
  };
}

export default {
  SingleDoc: {
    create: singleDocCreate,
    fetch: singleDocFetch,
    update: singleDocUpdate,
  },
};
