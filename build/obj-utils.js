"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapObjectToArray = mapObjectToArray;
exports.reduceObject = reduceObject;
exports.isObjectEmpty = isObjectEmpty;


/**
 * Enumerate the key / value pairs of an object, and map the returns value of
 * the enumeration function into an array.
 */
function mapObjectToArray(obj, cb) {
  const values = [];
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      values.push(cb(val, key, i));
      ++i;
    }
  }
  return values;
}

/**
 * Enumerate the key / value pairs of an object and reduce them to a single
 * value.
 */


/**
 * This file contains utilities for processing and manipulating objects. The
 * goal of this is to come up with a set of utilities for raw json objects that:
 *
 * (1) Works well with React
 * (2) Do not require creating new classes or types, everything is JSON
 * (3) Maintains immutability
 */

function reduceObject(obj, cb, initial) {
  let result = initial;
  let i = 0;
  // $FlowFixMe - Assumption of reasonable object implementation.
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];
      result = cb(result, val, key, i);
      ++i;
    }
  }

  return result;
}

function isObjectEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}