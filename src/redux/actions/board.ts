import { IBoard, IUnsplashPhoto } from '../../api/types';
import { IReduxAction } from '../types';
export const ASYNC_ADD_RECENT_BOARD = 'ASYNC_ADD_RECENT_BOARD';
export const ASYNC_CREATE_BOARD = 'ASYNC_CREATE_BOARD';
export const ASYNC_FETCH_ALL_BOARDS = 'ASYNC_FETCH_ALL_BOARDS';
export const ASYNC_FETCH_BOARD_BG_IMAGES = 'ASYNC_FETCH_BOARD_BG_IMAGES';
export const SET_CREATE_BOARD_DIALOG_VISIBLE =
  'SET_CREATE_BOARD_DIALOG_VISIBLE';
export const SET_PERSONAL_BOARD_LIST = 'SET_PERSONAL_BOARD_LIST';
export const SET_RECENT_BOARD_LIST = 'SET_RECENT_BOARD_LIST';
export const SET_STANDBY_BOARD_BG_IMAGES = 'SET_STANDBY_BOARD_BG_IMAGES';

export type IAsyncAddRecentBoardAction = IReduxAction<
  typeof ASYNC_ADD_RECENT_BOARD,
  { board: IBoard }
>;

export type IAsyncCreateBoardAction = IReduxAction<
  typeof ASYNC_CREATE_BOARD,
  { board: IBoard }
>;

export type IAsyncFetchAllBoardsAction = IReduxAction<
  typeof ASYNC_FETCH_ALL_BOARDS,
  void
>;

export type IAsyncFetchBoardBgImagesAction = IReduxAction<
  typeof ASYNC_FETCH_BOARD_BG_IMAGES,
  void
>;

export type ISetCreateBoardVisibleAction = IReduxAction<
  typeof SET_CREATE_BOARD_DIALOG_VISIBLE,
  { visible: boolean }
>;

export type ISetPersonalBoardListAction = IReduxAction<
  typeof SET_PERSONAL_BOARD_LIST,
  { boards: IBoard[] }
>;

export type ISetRecentBoardListAction = IReduxAction<
  typeof SET_RECENT_BOARD_LIST,
  { boards: IBoard[] }
>;

export type ISetStandbyBoardBgImagesAction = IReduxAction<
  typeof SET_STANDBY_BOARD_BG_IMAGES,
  { images: IUnsplashPhoto[] }
>;

export type IBoardAction =
  | IAsyncAddRecentBoardAction
  | IAsyncCreateBoardAction
  | IAsyncFetchAllBoardsAction
  | IAsyncFetchBoardBgImagesAction
  | ISetCreateBoardVisibleAction
  | ISetPersonalBoardListAction
  | ISetRecentBoardListAction
  | ISetStandbyBoardBgImagesAction;

export const asyncAddRecentBoard = (
  board: IBoard
): IAsyncAddRecentBoardAction => ({
  payload: { board },
  type: ASYNC_ADD_RECENT_BOARD,
});

export const asyncCreateBoard = (board: IBoard): IAsyncCreateBoardAction => ({
  payload: { board },
  type: ASYNC_CREATE_BOARD,
});

export const asyncFetchAllBoards = (): IAsyncFetchAllBoardsAction => ({
  payload: undefined,
  type: ASYNC_FETCH_ALL_BOARDS,
});

export const asyncFetchBoardBgImages = (): IAsyncFetchBoardBgImagesAction => ({
  payload: undefined,
  type: ASYNC_FETCH_BOARD_BG_IMAGES,
});

export const setCreateBoardDialogVisible = (
  visible: boolean
): ISetCreateBoardVisibleAction => ({
  payload: { visible },
  type: SET_CREATE_BOARD_DIALOG_VISIBLE,
});

export const setPersonalBoardList = (
  boards: IBoard[]
): ISetPersonalBoardListAction => ({
  payload: { boards },
  type: SET_PERSONAL_BOARD_LIST,
});

export const setRecentBoardList = (
  boards: IBoard[]
): ISetRecentBoardListAction => ({
  payload: { boards },
  type: SET_RECENT_BOARD_LIST,
});

export const setStandbyBoardBgImages = (
  images: IUnsplashPhoto[]
): ISetStandbyBoardBgImagesAction => ({
  payload: { images },
  type: SET_STANDBY_BOARD_BG_IMAGES,
});
