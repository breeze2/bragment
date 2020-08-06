import { IBoard, IPartial, IUnsplashPhoto } from '../../api/types';
import { IReduxAction } from '../types';

export const ASYNC_CREATE_BOARD = 'ASYNC_CREATE_BOARD';
export const ASYNC_FETCH_CURRENT_BOARD = 'ASYNC_FETCH_CURRENT_BOARD';
export const ASYNC_FETCH_BOARD_BG_IMAGES = 'ASYNC_FETCH_BOARD_BG_IMAGES';
export const ASYNC_FETCH_PERSONAL_BOARDS = 'ASYNC_FETCH_PERSONAL_BOARDS';
export const INSERT_BOARD = 'INSERT_BOARD';
export const SET_CREATE_BOARD_DIALOG_VISIBLE =
  'SET_CREATE_BOARD_DIALOG_VISIBLE';
export const SET_CURRENT_BOARD = 'SET_CURRENT_BOARD';
export const SET_BOARD_LOADING = 'SET_BOARD_LOADING';
export const SET_PERSONAL_BOARD_LIST = 'SET_PERSONAL_BOARD_LIST';
export const SET_STANDBY_BOARD_BG_IMAGES = 'SET_STANDBY_BOARD_BG_IMAGES';

export type IAsyncCreateBoardAction = IReduxAction<
  typeof ASYNC_CREATE_BOARD,
  { board: IPartial<IBoard> }
>;

export type IAsyncFetchPersonalBoardsAction = IReduxAction<
  typeof ASYNC_FETCH_PERSONAL_BOARDS,
  void
>;

export type IAsyncFetchBoardBgImagesAction = IReduxAction<
  typeof ASYNC_FETCH_BOARD_BG_IMAGES,
  void
>;

export type IAsyncFetchCurrentBoardAction = IReduxAction<
  typeof ASYNC_FETCH_CURRENT_BOARD,
  { id: string }
>;

export type IInsertBoardAction = IReduxAction<
  typeof INSERT_BOARD,
  { index: number; board: IBoard }
>;

export type ISetCreateBoardVisibleAction = IReduxAction<
  typeof SET_CREATE_BOARD_DIALOG_VISIBLE,
  { visible: boolean }
>;

export type ISetPersonalBoardListAction = IReduxAction<
  typeof SET_PERSONAL_BOARD_LIST,
  { boards: IBoard[] }
>;

export type ISetStandbyBoardBgImagesAction = IReduxAction<
  typeof SET_STANDBY_BOARD_BG_IMAGES,
  { images: IUnsplashPhoto[] }
>;

export type ISetCurrentBoardAction = IReduxAction<
  typeof SET_CURRENT_BOARD,
  { board: IBoard | null }
>;

export type ISetBoardLoadingAction = IReduxAction<
  typeof SET_BOARD_LOADING,
  { loading: boolean }
>;

export type IBoardAction =
  | IAsyncCreateBoardAction
  | IAsyncFetchPersonalBoardsAction
  | IAsyncFetchBoardBgImagesAction
  | IAsyncFetchCurrentBoardAction
  | IInsertBoardAction
  | ISetCreateBoardVisibleAction
  | ISetCurrentBoardAction
  | ISetBoardLoadingAction
  | ISetPersonalBoardListAction
  | ISetStandbyBoardBgImagesAction;

export const asyncCreateBoard = (
  board: IPartial<IBoard>
): IAsyncCreateBoardAction => ({
  payload: { board },
  type: ASYNC_CREATE_BOARD,
});

export const asyncFetchPersonalBoards = (): IAsyncFetchPersonalBoardsAction => ({
  payload: undefined,
  type: ASYNC_FETCH_PERSONAL_BOARDS,
});

export const asyncFetchCurrentBoard = (
  id: string
): IAsyncFetchCurrentBoardAction => ({
  payload: { id },
  type: ASYNC_FETCH_CURRENT_BOARD,
});

export const asyncFetchBoardBgImages = (): IAsyncFetchBoardBgImagesAction => ({
  payload: undefined,
  type: ASYNC_FETCH_BOARD_BG_IMAGES,
});

export const insertBoard = (
  index: number,
  board: IBoard
): IInsertBoardAction => ({
  payload: { index, board },
  type: INSERT_BOARD,
});

export const setCurrentBoard = (
  board: IBoard | null
): ISetCurrentBoardAction => ({
  payload: { board },
  type: SET_CURRENT_BOARD,
});

export const setBoardLoading = (loading: boolean): ISetBoardLoadingAction => ({
  payload: { loading },
  type: SET_BOARD_LOADING,
});

export const setPersonalBoardList = (
  boards: IBoard[]
): ISetPersonalBoardListAction => ({
  payload: { boards },
  type: SET_PERSONAL_BOARD_LIST,
});

export const setStandbyBoardBgImages = (
  images: IUnsplashPhoto[]
): ISetStandbyBoardBgImagesAction => ({
  payload: { images },
  type: SET_STANDBY_BOARD_BG_IMAGES,
});

export const setCreateBoardDialogVisible = (
  visible: boolean
): ISetCreateBoardVisibleAction => ({
  payload: { visible },
  type: SET_CREATE_BOARD_DIALOG_VISIBLE,
});
