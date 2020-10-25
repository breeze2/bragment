import { EBoardType, IFragmentColumn } from '../api/types';
import { boardSelectors } from './boardSlice';
import { fragmentCardSelectors } from './fragmentCardSlice';
import { fragmentColumnSelectors } from './fragmentColumnSlice';
import { IReduxState } from './types';

// for common
export function selectAppLanguage(state: IReduxState) {
  return state.common.language;
}

export function selectSignInDialogVisible(state: IReduxState) {
  return state.common.signInDialogVisible;
}

// for board
export function selectBoardEntities(state: IReduxState) {
  return boardSelectors.selectEntities(state.board);
}

export function selectGroupBoardList(state: IReduxState) {
  return boardSelectors
    .selectAll(state.board)
    .filter((el) => el.type === EBoardType.GROUP);
}

export function selectPersonalBoardList(state: IReduxState) {
  return boardSelectors
    .selectAll(state.board)
    .filter((el) => el.type === EBoardType.PERSONAL);
}

export function selectRecentlyBoardList(state: IReduxState) {
  return boardSelectors.selectAll(state.board).slice(0, 4);
}

export function selectCurrentBoard(state: IReduxState) {
  const boardId = state.board.currentId;
  if (boardId) {
    return boardSelectors.selectById(state.board, boardId);
  }
}

export function selectBoardLoading(state: IReduxState) {
  return state.board.loading;
}

export function selectStandbyBoardBgColors(state: IReduxState) {
  return state.board.standbyBgColors;
}

export function selectStandbyBoardBgImages(state: IReduxState) {
  return state.board.standbyBgImages;
}

export function selectCreateBoardDialogVisible(state: IReduxState) {
  return state.board.createDialogVisible;
}

// for fragment
export function selectFragmentColumnEntities(state: IReduxState) {
  return fragmentColumnSelectors.selectEntities(state.fragmentColumn);
}

export function selectFragmentCardEntities(state: IReduxState) {
  return fragmentCardSelectors.selectEntities(state.fragmentCard);
}

export function selectCurrentFragmentColumnList(state: IReduxState) {
  const board = selectCurrentBoard(state);
  const columnEntities = selectFragmentColumnEntities(state);
  if (board) {
    return board.columnOrder
      .filter((columnId) => columnEntities[columnId])
      .map((columnId) => columnEntities[columnId] as IFragmentColumn);
  }
  return [];
}

export function selectFragmentColumnLoading(state: IReduxState) {
  return state.fragmentColumn.loading;
}

export function selectCreateFragmentCardDialogVisible(state: IReduxState) {
  return state.fragmentCard.createDialogVisible;
}

export function selectCreateFragmentCardAsType(state: IReduxState) {
  return state.fragmentCard.createAsType;
}

export function selectFragmentCardCreateForColumn(state: IReduxState) {
  const columnId = state.fragmentCard.createForColumnId;
  if (columnId) {
    return fragmentColumnSelectors.selectById(state.fragmentColumn, columnId);
  }
}
