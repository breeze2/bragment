import Immutable from 'immutable';
import { boardComparatorByCheckedAt } from '../../api/board';
import { EBoardType } from '../../api/types';
import {
  IBoardAction,
  IInsertBoardAction,
  INSERT_BOARD,
  ISetCurrentBoardAction,
  ISetPersonalBoardListAction,
  SET_BOARD_LOADING,
  SET_CREATE_BOARD_DIALOG_VISIBLE,
  SET_CURRENT_BOARD,
  SET_PERSONAL_BOARD_LIST,
  SET_STANDBY_BOARD_BG_IMAGES,
} from '../actions';
import { IBoardState, IIBoardState } from '../types';

const RECENT_LIST_LENGTH = 4;

const initialBoardState = Immutable.Record<IBoardState>({
  createDialogVisible: false,
  current: null,
  groupList: Immutable.List([]),
  loading: false,
  personalList: Immutable.List([]),
  recentList: Immutable.List([]),
  standbyBgColors: Immutable.List([
    'var(--blue)',
    'var(--cyan)',
    'var(--green)',
    'var(--orange)',
    'var(--purple)',
    'var(--red)',
    'var(--yellow)',
    'var(--grey)',
  ]),
  standbyBgImages: Immutable.List([]),
})();

function handleInsertBoard(state: IIBoardState, action: IInsertBoardAction) {
  const { index, board } = action.payload;
  if (board.type === EBoardType.PERSONAL) {
    return state.update('personalList', (list) => list.insert(index, board));
  }
  return state;
}

function handleSetPersonalBoardList(
  state: IIBoardState,
  action: ISetPersonalBoardListAction
) {
  const personalList = Immutable.List(action.payload.boards).sort(
    boardComparatorByCheckedAt
  );

  state = state.set(
    'recentList',
    personalList.filter((el) => !!el.checkedAt).slice(0, RECENT_LIST_LENGTH)
  );
  return state.set('personalList', personalList);
}

function handleSetCurrentBoard(
  state: IIBoardState,
  action: ISetCurrentBoardAction
) {
  const personalList = state.personalList;
  const current = action.payload.board;
  if (personalList.size > 0) {
    state = state.update('recentList', (list) =>
      list
        .filter((el) => el.id !== current.id)
        .unshift(current)
        .slice(0, RECENT_LIST_LENGTH)
    );
  }
  return state.set('current', current);
}

const boardReducer = (state = initialBoardState, action: IBoardAction) => {
  switch (action.type) {
    case INSERT_BOARD:
      return handleInsertBoard(state, action);
    case SET_CREATE_BOARD_DIALOG_VISIBLE:
      return state.set('createDialogVisible', action.payload.visible);
    case SET_CURRENT_BOARD:
      return handleSetCurrentBoard(state, action);
    case SET_BOARD_LOADING:
      return state.set('loading', action.payload.loading);
    case SET_PERSONAL_BOARD_LIST:
      return handleSetPersonalBoardList(state, action);
    case SET_STANDBY_BOARD_BG_IMAGES:
      return state.set(
        'standbyBgImages',
        Immutable.List(action.payload.images)
      );
    default:
      return state;
  }
};

export default boardReducer;
