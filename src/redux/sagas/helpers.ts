import { IReduxAction, IReduxAsyncAction } from '../types';

export function* neverThrowWrapper(
  worker: (a: IReduxAction) => Generator<any>,
  action: IReduxAction
) {
  try {
    yield worker(action);
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
    const result = yield worker(action);
    return action.resolve(result);
  } catch (e) {
    return action.reject(e);
  }
}

export function makeSagaWorkerDispatcher(workersMap: {
  [key: string]: (action: IReduxAction) => Generator<any>;
}) {
  return function*(action: IReduxAction) {
    const worker = workersMap[action.type];
    if (worker) {
      if ('reject' in action && 'resolve' in action) {
        yield handlePromiseWrapper(worker, action as IReduxAsyncAction);
      } else {
        yield neverThrowWrapper(worker, action);
      }
    }
  };
}
