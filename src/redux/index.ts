import {
  AsyncThunkAction,
  configureStore,
  unwrapResult,
} from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { boardReducer } from './boardSlice';
import { cardReducer } from './cardSlice';
import { columnReducer } from './columnSlice';
import { commonReducer } from './commonSlice';
import { IReduxState } from './types';
import { userReducer } from './userSlice';

export const store = configureStore<IReduxState>({
  reducer: {
    board: boardReducer,
    common: commonReducer,
    card: cardReducer,
    column: columnReducer,
    user: userReducer,
  },
});

export const useReduxSelector = useSelector;
export const useReduxDispatch = () => useDispatch<typeof store.dispatch>();
export const useReduxAsyncDispatch = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  return useCallback(
    <R, A>(action: AsyncThunkAction<R, A, any>) =>
      dispatch(action).then(unwrapResult),
    [dispatch]
  );
};

export { commonActions } from './commonSlice';
export { userActions, userThunks } from './userSlice';
export { boardActions, boardThunks } from './boardSlice';
export { cardActions, cardThunks } from './cardSlice';
export { columnActions, columnThunks } from './columnSlice';

export * from './selectors';
