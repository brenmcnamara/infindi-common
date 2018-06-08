/* @flow */

import Provider from './Provider';

import { ModelFetcher } from './Model';

import type { ProviderRaw } from './Provider';

class ProviderFetcher extends ModelFetcher<'Provider', ProviderRaw, Provider> {
  static collectionName = 'Providers';
  static modelName = 'Provider';
}

export default new ProviderFetcher(Provider);
