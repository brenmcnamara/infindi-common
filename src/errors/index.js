/* @flow */

import type { ID } from 'common/types/core';

type EStub<TType: string> = {
  +errorMessage: string,
  +errorType: TType,
};

export type ErrorPayload =
  | ExternalServiceFailureType
  | MissingModelType
  | PermissionDeniedType
  | UnknownFailureType;

export type ExternalServiceFailureType = EStub<'EXTERNAL_SERVICE_FAILURE'> & {
  +serviceName: string,
};

function ExternalServiceFailure(serviceName: string, errorMessage: string) {
  return {
    errorMessage,
    errorType: 'EXTERNAL_SERVICE_FAILURE',
    serviceName,
  };
}

export type MissingModelType = EStub<'MISSING_MODEL'> & {
  +modelID: ID,
  +modelName: string,
};

function MissingModel(modelName: string, modelID: ID) {
  return {
    errorMessage: `Cannot find model with id ${modelID} of type ${modelName}`,
    errorType: 'MISSING_MODEL',
    modelID,
    modelName,
  };
}

export type PermissionDeniedType = EStub<'PERMISSION_DENIED'> & {
  +userID: ID,
};

function PermissionDenied(userID: ID) {
  return {
    errorMessage: 'Permission denied',
    errorType: 'PERMISSION_DENIED',
    userID,
  };
}

export type UnknownFailureType = EStub<'UNKNOWN_FAILURE'>;

function UnknownFailure(errorMessage: string) {
  return {
    errorMessage,
    errorType: 'UNKNOWN_FAILURE',
  };
}

export default {
  ExternalServiceFailure,
  MissingModel,
  PermissionDenied,
  UnknownFailure,
};
