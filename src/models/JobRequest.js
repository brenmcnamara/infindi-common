/* @flow */

import type { ID, ModelStub, Seconds } from './core';

/**
 * A request for a job that a worker process needs to execute. Jobs are
 * listened to by the worker instances and picked up for processeing
 * regularly.
 */
export type JobRequest = ModelStub<'JobRequest'> & {
  +completionTime: Seconds | null,
  +errorCode: string | null,
  +name: string,
  +payload: Object,
  +status: 'RUNNING' | 'UNCLAIMED' | 'COMPLETE' | 'FAILED',
  +timeout: Seconds,
  +workerID: ID | null,
};
