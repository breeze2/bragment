import { IBoard, IUnsplashPhoto } from '../../api/types';
import { IReduxAction } from '../types';
export const ASYNC_INSERT_RECENT_BOARD = 'ASYNC_INSERT_RECENT_BOARD';
export const ASYNC_CREATE_BOARD = 'ASYNC_CREATE_BOARD';
export const ASYNC_FETCH_ALL_BOARDS = 'ASYNC_FETCH_ALL_BOARDS';
export const ASYNC_FETCH_BOARD_BG_IMAGES = 'ASYNC_FETCH_BOARD_BG_IMAGES';
export const ASYNC_FETCH_CURRENT_BOARD = 'ASYNC_FETCH_CURRENT_BOARD';
export const INSERT_BOARD = 'INSERT_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const SET_CREATE_BOARD_DIALOG_VISIBLE =
  'SET_CREATE_BOARD_DIALOG_VISIBLE';
export const SET_ALL_BOARD_LIST = 'SET_ALL_BOARD_LIST';
export const SET_CURRENT_BOARD = 'SET_CURRENT_BOARD';
export const SET_STANDBY_BOARD_BG_IMAGES = 'SET_STANDBY_BOARD_BG_IMAGES';

export type IAsyncInsertRecentBoardAction = IReduxAction<
  typeof ASYNC_INSERT_RECENT_BOARD,
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

export type IAsyncFetchCurrentBoardAction = IReduxAction<
  typeof ASYNC_FETCH_CURRENT_BOARD,
  { boardID: number }
>;

export type IInsertBoardAction = IReduxAction<
  typeof INSERT_BOARD,
  { index: number; board: IBoard }
>;

export type IUpdateBoardAction = IReduxAction<
  typeof UPDATE_BOARD,
  { index: number; board: IBoard }
>;

export type ISetCreateBoardVisibleAction = IReduxAction<
  typeof SET_CREATE_BOARD_DIALOG_VISIBLE,
  { visible: boolean }
>;

export type ISetAllBoardListAction = IReduxAction<
  typeof SET_ALL_BOARD_LIST,
  { boards: IBoard[] }
>;

export type ISetStandbyBoardBgImagesAction = IReduxAction<
  typeof SET_STANDBY_BOARD_BG_IMAGES,
  { images: IUnsplashPhoto[] }
>;

export type ISetCurrentBoardAction = IReduxAction<
  typeof SET_CURRENT_BOARD,
  { board: IBoard }
>;

export type IBoardAction =
  | IAsyncInsertRecentBoardAction
  | IAsyncCreateBoardAction
  | IAsyncFetchAllBoardsAction
  | IAsyncFetchBoardBgImagesAction
  | IAsyncFetchCurrentBoardAction
  | IInsertBoardAction
  | ISetCreateBoardVisibleAction
  | ISetCurrentBoardAction
  | ISetAllBoardListAction
  | ISetStandbyBoardBgImagesAction
  | IUpdateBoardAction;

export const asyncAddRecentBoard = (
  board: IBoard
): IAsyncInsertRecentBoardAction => ({
  payload: { board },
  type: ASYNC_INSERT_RECENT_BOARD,
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

export const asyncFetchCurrentBoard = (
  boardID: number
): IAsyncFetchCurrentBoardAction => ({
  payload: { boardID },
  type: ASYNC_FETCH_CURRENT_BOARD,
});

export const insertBoard = (
  index: number,
  board: IBoard
): IInsertBoardAction => ({
  payload: { index, board },
  type: INSERT_BOARD,
});

export const updateBoard = (
  index: number,
  board: IBoard
): IUpdateBoardAction => ({
  payload: { index, board },
  type: UPDATE_BOARD,
});

export const setCreateBoardDialogVisible = (
  visible: boolean
): ISetCreateBoardVisibleAction => ({
  payload: { visible },
  type: SET_CREATE_BOARD_DIALOG_VISIBLE,
});

export const setAllBoardList = (boards: IBoard[]): ISetAllBoardListAction => ({
  payload: { boards },
  type: SET_ALL_BOARD_LIST,
});

export const setStandbyBoardBgImages = (
  images: IUnsplashPhoto[]
): ISetStandbyBoardBgImagesAction => ({
  payload: { images },
  type: SET_STANDBY_BOARD_BG_IMAGES,
});

export const setCurrentBoard = (board: IBoard): ISetCurrentBoardAction => ({
  payload: { board },
  type: SET_CURRENT_BOARD,
});
