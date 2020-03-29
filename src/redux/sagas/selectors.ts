import { IReduxState } from '../types';
export const getAllBoards = (state: IReduxState) => state.board.all;
export const getCurrentBoard = (state: IReduxState) => state.board.current;
export const getFragmentColumns = (state: IReduxState) =>
  state.fragment.columns;
