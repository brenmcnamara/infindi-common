/* @flow */

import { ModelMutator } from './_Model';

import type Provider, { ProviderRaw } from './Provider';

class ProviderMutator extends ModelMutator<'Provider', ProviderRaw, Provider> {
  static collectionName = 'Providers';
  static modelName = 'Provider';
}

export default new ProviderMutator();
