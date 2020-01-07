import Immutable from 'immutable';
import {
  IBoardAction,
  SET_CREATE_BOARD_DIALOG_VISIBLE,
  SET_PERSONAL_BOARD_LIST,
  SET_RECENT_BOARD_LIST,
  SET_STANDBY_BOARD_BG_IMAGES,
} from '../actions';
import { IBoardState } from '../types';

const initialBoardState = Immutable.Record<IBoardState>({
  createDialogVisible: false,
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

const boardReducer = (state = initialBoardState, action: IBoardAction) => {
  switch (action.type) {
    case SET_CREATE_BOARD_DIALOG_VISIBLE:
      return state.set('createDialogVisible', action.payload.visible);
    case SET_PERSONAL_BOARD_LIST:
      return state.set('personalList', Immutable.List(action.payload.boards));
    case SET_RECENT_BOARD_LIST:
      return state.set('recentList', Immutable.List(action.payload.boards));
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
