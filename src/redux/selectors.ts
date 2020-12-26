import { EBoardType, IBoard, IColumn } from '../api/types';
import { boardSelectors } from './boardSlice';
import { cardSelectors } from './cardSlice';
import { columnSelectors } from './columnSlice';
import { AUTHENTICATING, IReduxState } from './types';

// for common
export function selectAppLanguage(state: IReduxState) {
  return state.common.language;
}

// for user
export function selectCurrentUserId(state: IReduxState) {
  return state.user.currentId;
}

export function selectUserSignInDialogVisible(state: IReduxState) {
  return state.user.signInDialogVisible;
}

export function selectUserSignedIn(state: IReduxState) {
  return !!state.user.currentId && state.user.currentId !== AUTHENTICATING;
}

export function selectUserAuthenticating(state: IReduxState) {
  return state.user.currentId === AUTHENTICATING;
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
  const ids = state.board.recentBoardIds;
  const list: IBoard[] = [];
  const boardMap = boardSelectors.selectEntities(state.board);
  for (const id of ids) {
    const board = boardMap[id];
    if (board) {
      list.push(board);
    }
    if (list.length > 3) {
      break;
    }
  }
  return list;
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

// for column
export function selectColumnEntities(state: IReduxState) {
  return columnSelectors.selectEntities(state.column);
}
export function selectCurrentColumnList(state: IReduxState) {
  const board = selectCurrentBoard(state);
  const columnEntities = selectColumnEntities(state);
  if (board) {
    return board.columnOrder
      .filter((columnId) => columnEntities[columnId])
      .map((columnId) => columnEntities[columnId] as IColumn);
  }
  return [];
}
export function selectColumnLoading(state: IReduxState) {
  return state.column.loading;
}

// for card
export function selectCardEntities(state: IReduxState) {
  return cardSelectors.selectEntities(state.card);
}
export function selectCreateCardDialogVisible(state: IReduxState) {
  return state.card.createDialogVisible;
}
export function selectCreateCardAsType(state: IReduxState) {
  return state.card.createAsType;
}
export function selectCreateCardForColumn(state: IReduxState) {
  const columnId = state.card.createForColumnId;
  if (columnId) {
    return columnSelectors.selectById(state.column, columnId);
  }
}
