import { IBoard, IFragmentColumn } from '../../api/types';
import { IReduxAction } from '../types';

export enum EFragmentActionError {
  EXISTED_ARCHIVE,
  EXISTED_DIRECTORY,
  EXISTED_FILE,
  UNKNOWN,
}

export const ASYNC_CREATE_FRAGMENT_COLUMN = 'ASYNC_CREATE_FRAGMENT_COLUMN';
export const ASYNC_RENAME_FRAGMENT_COLUMN = 'ASYNC_RENAME_FRAGMENT_COLUMN';
export const ASYNC_SAVE_FRAGMENT_COLUMNS_DATA =
  'ASYNC_SAVE_FRAGMENT_COLUMNS_DATA';
export const SET_FRAGMENT_COLUMNS = 'SET_FRAGMENT_COLUMNS';
export const PUSH_FRAGMENT_COLUMN = 'PUSH_FRAGMENT_COLUMN';
export const MOVE_FRAGMENT_COLUMN = 'MOVE_FRAGMENT_COLUMN';
export const RENAME_FRAGMENT_COLUMN = 'RENAME_FRAGMENT_COLUMN';

export type ISetFragmentColumnsAction = IReduxAction<
  typeof SET_FRAGMENT_COLUMNS,
  { columns: IFragmentColumn[] }
>;

export type IPushFragmentColumnAction = IReduxAction<
  typeof PUSH_FRAGMENT_COLUMN,
  { column: IFragmentColumn }
>;

export type IMoveFragmentColumnAction = IReduxAction<
  typeof MOVE_FRAGMENT_COLUMN,
  {
    from: number;
    to: number;
  }
>;

export type IRenameFragmentColumnAction = IReduxAction<
  typeof RENAME_FRAGMENT_COLUMN,
  {
    from: string;
    to: string;
  }
>;

export type IAsyncCreateFragmentColumnAction = IReduxAction<
  typeof ASYNC_CREATE_FRAGMENT_COLUMN,
  { board: IBoard; title: string }
>;

export type IAsyncRenameFragmentColumnAction = IReduxAction<
  typeof ASYNC_RENAME_FRAGMENT_COLUMN,
  { oldTitle: string; newTitle: string }
>;

export type IAsyncSaveFragmentColumnsDataAction = IReduxAction<
  typeof ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
  void
>;

export type IFragmentAction =
  | IAsyncCreateFragmentColumnAction
  | IAsyncRenameFragmentColumnAction
  | IPushFragmentColumnAction
  | IMoveFragmentColumnAction
  | IRenameFragmentColumnAction
  | ISetFragmentColumnsAction;

export const asyncCreateFragmentColumn = (
  board: IBoard,
  title: string
): IAsyncCreateFragmentColumnAction => ({
  payload: { board, title },
  type: ASYNC_CREATE_FRAGMENT_COLUMN,
});

export const asyncRenameFragmentColumn = (
  oldTitle: string,
  newTitle: string
): IAsyncRenameFragmentColumnAction => ({
  payload: { oldTitle, newTitle },
  type: ASYNC_RENAME_FRAGMENT_COLUMN,
});

export const asyncSaveFragmentColumnsData = (): IAsyncSaveFragmentColumnsDataAction => ({
  type: ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
  payload: undefined,
});

export const setFragmentColumns = (
  columns: IFragmentColumn[]
): ISetFragmentColumnsAction => ({
  payload: { columns },
  type: SET_FRAGMENT_COLUMNS,
});

export const pushFragmentColumn = (
  column: IFragmentColumn
): IPushFragmentColumnAction => ({
  payload: { column },
  type: PUSH_FRAGMENT_COLUMN,
});

export const moveFragmentColumn = (
  from: number,
  to: number
): IMoveFragmentColumnAction => ({
  payload: { from, to },
  type: MOVE_FRAGMENT_COLUMN,
});

export const renameFragmentColumn = (
  from: string,
  to: string
): IRenameFragmentColumnAction => ({
  payload: { from, to },
  type: RENAME_FRAGMENT_COLUMN,
});
