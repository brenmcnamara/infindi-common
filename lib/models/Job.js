'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getJobCollection = getJobCollection;
exports.listenForJobs = listenForJobs;
exports.genCreateJob = genCreateJob;
exports.genUpdateJob = genUpdateJob;
exports.genDeleteJob = genDeleteJob;
exports.createJob = createJob;
exports.updateJobStatus = updateJobStatus;
exports.getTimeTillRunMillis = getTimeTillRunMillis;
exports.isDone = isDone;
exports.isRunning = isRunning;

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

function genUpdateJob(job) {
  return getJobCollection().doc(job.id).update(job);
}

function genDeleteJob(job) {
  return getJobCollection().doc(job.id).delete();
}

function createJob(endpoint, body, schedule) {
  return _extends({}, (0, _dbUtils.createModelStub)('Job'), {
    body,
    endpoint,
    schedule,
    status: 'NOT_RUN'
  });
}
function updateJobStatus(job, status) {
  const statusChange = `${job.status} -> ${status}`;
  switch (statusChange) {
    case 'NOT_RUN -> RUNNING':
    case 'RUNNING -> SUCCESS':
    case 'RUNNING -> FAILURE':
      // $FlowFixMe - Why is this an error?
      return _extends({}, (0, _dbUtils.updateModelStub)(job), {
        status
      });
    default:
      return (0, _invariant2.default)(false, 'Invalid job status change: %s', statusChange);
  }
}

// The amount of time until the job needs to be run. Null if we should not
// run this job.
function getTimeTillRunMillis(job) {
  if (isDone(job) || isRunning(job)) {
    return null;
  }

  const { schedule } = job;
  (0, _invariant2.default)(schedule.recurringType === 'ONCE', 'Scheduling jobs only supports schedule type ONCE');
  const runAtMillis = schedule.runAt;
  const nowMillis = Date.now();
  return Math.max(0, runAtMillis - nowMillis);
}

function isDone(job) {
  return job.status === 'SUCCESS' || job.status === 'FAILURE';
}

function isRunning(job) {
  return job.status === 'RUNNING';
}