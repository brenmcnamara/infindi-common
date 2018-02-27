/* @flow */

import invariant from 'invariant';

import { createModelStub, updateModelStub } from '../db-utils';
import { getFirebaseAdmin } from '../config';

import type { ModelStub } from '../../types/core';

export type JobStatus = 'NOT_RUN' | 'RUNNING' | 'SUCCESS' | 'FAILURE';

export type JobSchedule = {|
  +recurringType: 'ONCE',
  +runAt: Date,
|};

export type Job = ModelStub<'Job'> & {
  +body: Object,
  +endpoint: string,
  +schedule: JobSchedule,
  +status: JobStatus,
};

export type Subscription = {
  remove: () => any,
};

export function getJobCollection() {
  return getFirebaseAdmin()
    .firestore()
    .collection('Jobs');
}

export function listenForJobs(
  callback: (jobs: Array<Job>) => any,
): Subscription {
  const remove = getJobCollection().onSnapshot(snapshot => {
    const jobs = snapshot.docs.filter(doc => doc.exists).map(doc => doc.data());
    callback(jobs);
  });
  return { remove };
}

export function genCreateJob(job: Job): Promise<void> {
  return getJobCollection()
    .doc(job.id)
    .set(job);
}

export function genUpdateJob(job: Job): Promise<void> {
  return getJobCollection()
    .doc(job.id)
    .update(job);
}

export function genDeleteJob(job: Job): Promise<void> {
  return getJobCollection()
    .doc(job.id)
    .delete();
}

export function createJob(
  endpoint: string,
  body: Object,
  schedule: JobSchedule,
): Job {
  return {
    ...createModelStub('Job'),
    body,
    endpoint,
    schedule,
    status: 'NOT_RUN',
  };
}
export function updateJobStatus(job: Job, status: JobStatus): Job {
  const statusChange = `${job.status} -> ${status}`;
  switch (statusChange) {
    case 'NOT_RUN -> RUNNING':
    case 'RUNNING -> SUCCESS':
    case 'RUNNING -> FAILURE':
      // $FlowFixMe - Why is this an error?
      return {
        ...updateModelStub(job),
        status,
      };
    default:
      return invariant(false, 'Invalid job status change: %s', statusChange);
  }
}

// The amount of time until the job needs to be run. Null if we should not
// run this job.
export function getTimeTillRunMillis(job: Job): number | null {
  if (isDone(job) || isRunning(job)) {
    return null;
  }

  const { schedule } = job;
  invariant(
    schedule.recurringType === 'ONCE',
    'Scheduling jobs only supports schedule type ONCE',
  );
  const runAtMillis = schedule.runAt;
  const nowMillis = Date.now();
  return Math.max(0, runAtMillis - nowMillis);
}

export function isDone(job: Job): bool {
  return job.status === 'SUCCESS' || job.status === 'FAILURE';
}

export function isRunning(job: Job): bool {
  return job.status === 'RUNNING';
}
