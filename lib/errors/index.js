'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ExternalServiceFailure(serviceName, errorMessage) {
  return {
    errorMessage,
    errorType: 'EXTERNAL_SERVICE_FAILURE',
    serviceName
  };
}

function MissingModel(modelName, modelID) {
  return {
    errorMessage: `Cannot find model with id ${modelID} of type ${modelName}`,
    errorType: 'MISSING_MODEL',
    modelID,
    modelName
  };
}

function PermissionDenied(userID) {
  return {
    errorMessage: 'Permission denied',
    errorType: 'PERMISSION_DENIED',
    userID
  };
}

function UnknownFailure(errorMessage) {
  return {
    errorMessage,
    errorType: 'UNKNOWN_FAILURE'
  };
}

exports.default = {
  ExternalServiceFailure,
  MissingModel,
  PermissionDenied,
  UnknownFailure
};