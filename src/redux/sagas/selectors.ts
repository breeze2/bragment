import { IReduxState } from '../types';
export const getPersonalBoards = (state: IReduxState) =>
  state.board.personalList;
export const getCurrentBoard = (state: IReduxState) => state.board.current;
export const getFragmentColumnMap = (state: IReduxState) =>
  state.fragment.columnMap;
