/* @flow */

import uuid from 'uuid/v4';

import type { ModelStub } from './types/core';

/**
 * Creates the core properties of a model stub. Properties then must be added
 * to the stub to get a full model.
 */
export function createModelStub<TName: string>(name: TName): ModelStub<TName> {
  const now = new Date();
  return {
    createdAt: now,
    id: uuid(),
    modelType: name,
    type: 'MODEL',
    updatedAt: now,
  };
}

/**
 * Update an existing model's modelStub properties. The caller is responsible
 * for updating the properties specific to the model itself.
 */
export function updateModelStub<TName: string, TModel: ModelStub<TName>>(
  model: TModel,
): TModel {
  const now = new Date();
  return {
    ...model,
    updatedAt: now,
  };
}
