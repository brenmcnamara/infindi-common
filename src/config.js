/* @flow */

import invariant from 'invariant';

let _isInitialized: bool = false;
let _Firebase: * | null = null;
let _FirebaseAdmin: * | null = null;

export function initialize(Firebase: *) {
  invariant(!_isInitialized, 'Trying to initialize common more than once');
  _isInitialized = true;
  _Firebase = Firebase;
}

export function initializeAsAdmin(FirebaseAdmin: *) {
  invariant(!_isInitialized, 'Trying to initialize common more than once');
  _isInitialized = true;
  _FirebaseAdmin = FirebaseAdmin;
}

export function getFirebase() {
  invariant(_isInitialized && _Firebase, 'Expected config to be initialized');
  return _Firebase;
}

export function getFirebaseAdmin() {
  invariant(
    _isInitialized && _FirebaseAdmin,
    'Expected config to be initialized in admin mode',
  );
  return _FirebaseAdmin;
}

export function getFirebaseAdminOrClient(): Object {
  invariant(
    _isInitialized && (_Firebase || _FirebaseAdmin),
    'Either firebase or firebase admin needs to be configured',
  );
  // $FlowFixMe - Cannot be null
  return _FirebaseAdmin || _Firebase;
}
