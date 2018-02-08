'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getJobCollection = getJobCollection;
exports.listenForJobs = listenForJobs;
exports.genCreateJob = genCreateJob;
exports.genDeleteJob = genDeleteJob;
exports.createJob = createJob;
exports.isExpired = isExpired;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _dbUtils = require('../db-utils');

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getJobCollection() {
  return (0, _config.getFirebaseAdmin)().firestore().collection('Jobs');
}

function listenForJobs(callback) {
  const remove = getJobCollection().onSnapshot(snapshot => {
    const jobs = snapshot.docs.filter(doc => doc.exists).map(doc => doc.data());
    callback(jobs);
  });
  return { remove };
}

function genCreateJob(job) {
  return getJobCollection().doc(job.id).set(job);
}

function genDeleteJob(job) {
  return getJobCollection().doc(job.id).delete();
}

function createJob(endpoint, body, schedule) {
  return _extends({}, (0, _dbUtils.createModelStub)('Job'), {
    body,
    endpoint,
    schedule
  });
}

function isExpired(job) {
  const { schedule } = job;
  (0, _invariant2.default)(schedule.recurringType === 'ONCE', 'Checking job expiration only works for schedule type ONCE');
  return schedule.runAt.getTime() < Date.now();
}