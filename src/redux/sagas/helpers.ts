import { call } from 'redux-saga/effects';
import { IReduxAction, IReduxAsyncAction } from '../types';

export function* neverThrowWrapper(
  worker: (a: IReduxAction) => Generator<any>,
  action: IReduxAction
) {
  try {
    yield call(worker, action);
  } catch (e) {
    // TODO: send to sentry
    console.error(e);
  }
}

export function* handlePromiseWrapper(
  worker: (a: IReduxAction) => Generator<any>,
  action: IReduxAsyncAction
) {
  try {
    const result = yield call(worker, action);
    action.resolve(result);
    return result;
  } catch (e) {
    return action.reject(e);
  }
}

export function makeSagaWorkerDispatcher(workersMap: {
  [key: string]: (action: IReduxAction) => Generator<any>;
}) {
  return function* (action: IReduxAction) {
    const worker = workersMap[action.type];
    if (worker) {
      if ('reject' in action && 'resolve' in action) {
        const result = yield call(
          handlePromiseWrapper,
          worker,
          action as IReduxAsyncAction
        );
        return result;
      } else {
        yield call(neverThrowWrapper, worker, action);
      }
    }
  };
}
