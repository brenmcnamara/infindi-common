/* @flow */

import invariant from 'invariant';

import { createModelStub } from '../db-utils';
import { getFirebaseAdmin } from '../config';

import type { ModelStub } from '../../types/core';

export type JobSchedule = {|
  +recurringType: 'ONCE',
  +runAt: Date,
|};

export type Job = ModelStub<'Job'> & {
  +body: Object,
  +endpoint: string,
  +schedule: JobSchedule,
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
  };
}

export function isExpired(job: Job): bool {
  const { schedule } = job;
  invariant(
    schedule.recurringType === 'ONCE',
    'Checking job expiration only works for schedule type ONCE',
  );
  return schedule.runAt.getTime() < Date.now();
}
