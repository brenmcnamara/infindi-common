/* @flow */

import invariant from 'invariant';

import { createModelStub } from '../db-utils';
import { Model } from './_Model';

import type { ID, ModelStub } from '../../types/core';
import type { Map } from 'immutable';
import type { ProviderFull as YodleeProviderFull } from '../../types/yodlee-v1.0';

// -----------------------------------------------------------------------------
//
// RAW
//
// -----------------------------------------------------------------------------

export type ProviderRaw = ModelStub<'Provider'> & {
  isDeprecated: boolean,
  quirkCount: number,
  quirks: Array<string>,
  sourceOfTruth: SourceOfTruth,
};

export type SourceOfTruth = {|
  +type: 'YODLEE',
  +value: YodleeProviderFull,
|};

export type ProviderCollection = Map<ID, Provider>;

// -----------------------------------------------------------------------------
//
// MODEL
//
// -----------------------------------------------------------------------------

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

  static create(sourceOfTruth: SourceOfTruth, quirks: Array<string>): Provider {
    const raw = {
      ...createModelStub('Provider'),
      id: calculateIDFromSourceOfTruth(sourceOfTruth),
      isDeprecated: false,
      quirkCount: quirks.length,
      quirks,
      sourceOfTruth,
    };
    return Provider.fromRaw(raw);
  }

  // ---------------------------------------------------------------------------
  // ORIGINAL GETTERS (boilerplate)
  // ---------------------------------------------------------------------------
  get isDeprecated(): boolean {
    return this.__raw.isDeprecated;
  }

  get quirkCount(): number {
    return this.__raw.quirkCount;
  }

  get quirks(): Array<string> {
    return this.__raw.quirks;
  }

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
