/* @flow */

import invariant from 'invariant';

import { createModelStub } from '../db-utils';
import { Model } from './Model';

import type Immutable from 'immutable';

import type { ID, ModelStub } from '../../types/core';
import type { Provider as YodleeProvider } from '../../types/yodlee-v1.1';

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

export type ProviderRaw = ModelStub<'Provider'> & {
  sourceOfTruth: SourceOfTruth,
};

export type SourceOfTruth = {|
  +type: 'YODLEE',
  +value: YodleeProvider,
|};

export type ProviderCollection = Immutable.Map<ID, Provider>;
export type ProviderOrderedCollection = Immutable.OrderedMap<ID, Provider>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

/**
 * A financial institution that provides third-party integration for accessing
 * data.
 */
export default class Provider extends Model<'Provider', ProviderRaw> {
  // ---------------------------------------------------------------------------
  // EXTENDING MODEL (boilerplate)
  // ---------------------------------------------------------------------------
  static collectionName = 'Providers';
  static modelName = 'Provider';

  __raw: ProviderRaw;

  // ---------------------------------------------------------------------------
  // CREATORS (custom)
  // ---------------------------------------------------------------------------

  static create(sourceOfTruth: SourceOfTruth): Provider {
    const raw = {
      ...createModelStub('Provider'),
      id: calculateIDFromSourceOfTruth(sourceOfTruth),
      sourceOfTruth,
    };
    return Provider.fromRaw(raw);
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get sourceOfTruth(): SourceOfTruth {
    return this.__raw.sourceOfTruth;
  }

  // ---------------------------------------------------------------------------
  // COMPUTED GETTERS (custom)
  // ---------------------------------------------------------------------------
  get name(): string {
    invariant(
      this.sourceOfTruth.type === 'YODLEE',
      'Expecting provider to come from YODLEE',
    );
    return this.sourceOfTruth.value.name;
  }

  get sourceOfTruthID(): ID {
    switch (this.sourceOfTruth.type) {
      case 'YODLEE': {
        return String(this.sourceOfTruth.value.id);
      }

      default:
        invariant(
          false,
          'Unrecognized sourceOfTruth: %s',
          this.sourceOfTruth.type,
        );
    }
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL SETTERS (boilerplate)
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // COMPUTED SETTERS (custom)
  // ---------------------------------------------------------------------------
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function calculateIDFromSourceOfTruth(sourceOfTruth: SourceOfTruth): ID {
  switch (sourceOfTruth.type) {
    case 'YODLEE': {
      return String(sourceOfTruth.value.id);
    }

    default:
      invariant(false, 'Unrecognized sourceOfTruth: %s', sourceOfTruth.type);
  }
}
