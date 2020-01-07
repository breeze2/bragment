import { Dispatch } from 'redux';
import { IReduxAction, IReduxAsyncAction } from '../types';

export function asyncDispatch<Type = any>(
  dispatch: Dispatch<IReduxAction>,
  action: IReduxAction
) {
  return new Promise<Type>((resolve, reject) => {
    const asyncAction: IReduxAsyncAction = {
      ...action,
      reject,
      resolve,
    };
    dispatch(asyncAction);
  });
}
