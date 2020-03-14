import Immutable from 'immutable';
import { EBoardType, IBoard } from '../../api/types';
import {
  IBoardAction,
  IInsertBoardAction,
  INSERT_BOARD,
  ISetAllBoardListAction,
  ISetCurrentBoardAction,
  SET_ALL_BOARD_LIST,
  SET_CREATE_BOARD_DIALOG_VISIBLE,
  SET_CURRENT_BOARD,
  SET_STANDBY_BOARD_BG_IMAGES,
} from '../actions';
import { IBoardState, IIBoardState } from '../types';

const initialBoardState = Immutable.Record<IBoardState>({
  all: Immutable.List([]),
  createDialogVisible: false,
  current: null,
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

function refreshAllBoards(state: IIBoardState, all: Immutable.List<IBoard>) {
  return state
    .set('all', all)
    .set(
      'personalList',
      all.filter(board => board.type === EBoardType.PERSON)
    )
    .set(
      'recentList',
      all.sort((a, b) => b.checked_at - a.checked_at).slice(0, 4)
    );
}

function handleInsertBoard(state: IIBoardState, action: IInsertBoardAction) {
  const all = state.get('all');
  const { index, board } = action.payload;
  return refreshAllBoards(state, all.splice(index, 0, board));
}

function handleSetAllBoardList(
  state: IIBoardState,
  action: ISetAllBoardListAction
) {
  const all = Immutable.List(action.payload.boards);
  return refreshAllBoards(state, all);
}

function handleSetCurrentBoard(
  state: IIBoardState,
  action: ISetCurrentBoardAction
) {
  let all = state.get('all');
  const current = action.payload.board;
  const index = all.findIndex(
    board => board.id === current.id && board.path === current.path
  );
  all = all.setIn([index, 'checked_at'], current.checked_at);
  return state
    .set('current', current)
    .set('all', all)
    .set(
      'recentList',
      all.sort((a, b) => b.checked_at - a.checked_at).slice(0, 4)
    );
}

const boardReducer = (state = initialBoardState, action: IBoardAction) => {
  switch (action.type) {
    case INSERT_BOARD:
      return handleInsertBoard(state, action);
    case SET_CREATE_BOARD_DIALOG_VISIBLE:
      return state.set('createDialogVisible', action.payload.visible);
    case SET_CURRENT_BOARD:
      return handleSetCurrentBoard(state, action);
    case SET_ALL_BOARD_LIST:
      return handleSetAllBoardList(state, action);
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
