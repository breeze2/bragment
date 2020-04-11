import {
  EFragmentType,
  IBoard,
  IFragment,
  IFragmentColumn,
} from '../../api/types';
import { IReduxAction } from '../types';

export enum EFragmentActionError {
  EXISTED_ARCHIVE,
  EXISTED_DIRECTORY,
  EXISTED_FILE,
  UNKNOWN,
}

export const ASYNC_CREATE_FRAGMENT = 'ASYNC_CREATE_FRAGMENT';
export const ASYNC_MOVE_FRAGMENT = 'ASYNC_MOVE_FRAGMENT';
export const ASYNC_CREATE_FRAGMENT_COLUMN = 'ASYNC_CREATE_FRAGMENT_COLUMN';
export const ASYNC_RENAME_FRAGMENT_COLUMN = 'ASYNC_RENAME_FRAGMENT_COLUMN';
export const ASYNC_SAVE_FRAGMENT_COLUMNS_DATA =
  'ASYNC_SAVE_FRAGMENT_COLUMNS_DATA';
export const SET_FRAGMENT_COLUMNS = 'SET_FRAGMENT_COLUMNS';
export const PUSH_FRAGMENT = 'PUSH_FRAGMENT';
export const PUSH_FRAGMENT_COLUMN = 'PUSH_FRAGMENT_COLUMN';
export const MOVE_FRAGMENT = 'MOVE_FRAGMENT';
export const MOVE_FRAGMENT_COLUMN = 'MOVE_FRAGMENT_COLUMN';
export const RENAME_FRAGMENT_COLUMN = 'RENAME_FRAGMENT_COLUMN';

export type ISetFragmentColumnsAction = IReduxAction<
  typeof SET_FRAGMENT_COLUMNS,
  { columns: IFragmentColumn[] }
>;

export type IPushFragmentAction = IReduxAction<
  typeof PUSH_FRAGMENT,
  { columnID: string; fragment: IFragment }
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

export type IMoveFragmentAction = IReduxAction<
  typeof MOVE_FRAGMENT,
  {
    fromColumnID: string;
    fromIndex: number;
    toColumnID: string;
    toIndex: number;
    newID?: string;
  }
>;

export type IRenameFragmentColumnAction = IReduxAction<
  typeof RENAME_FRAGMENT_COLUMN,
  {
    id: string;
    title: string;
  }
>;

export type IAsyncCreateFragmentAction = IReduxAction<
  typeof ASYNC_CREATE_FRAGMENT,
  {
    board: IBoard;
    columnID: string;
    title: string;
    tags?: string[];
    type: EFragmentType;
  }
>;

export type IAsyncMoveFragmentAction = IReduxAction<
  typeof ASYNC_MOVE_FRAGMENT,
  {
    fromColumnID: string;
    fromIndex: number;
    toColumnID: string;
    toIndex: number;
  }
>;

export type IAsyncCreateFragmentColumnAction = IReduxAction<
  typeof ASYNC_CREATE_FRAGMENT_COLUMN,
  { board: IBoard; title: string }
>;

export type IAsyncRenameFragmentColumnAction = IReduxAction<
  typeof ASYNC_RENAME_FRAGMENT_COLUMN,
  { id: string; title: string }
>;

export type IAsyncSaveFragmentColumnsDataAction = IReduxAction<
  typeof ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
  void
>;

export type IFragmentAction =
  | IAsyncCreateFragmentAction
  | IAsyncCreateFragmentColumnAction
  | IAsyncMoveFragmentAction
  | IAsyncRenameFragmentColumnAction
  | IPushFragmentAction
  | IMoveFragmentAction
  | IPushFragmentColumnAction
  | IMoveFragmentColumnAction
  | IRenameFragmentColumnAction
  | ISetFragmentColumnsAction;

export const asyncCreateFragment = (
  board: IBoard,
  columnID: string,
  title: string,
  type: EFragmentType,
  tags?: string[]
): IAsyncCreateFragmentAction => ({
  payload: { board, columnID, title, tags, type },
  type: ASYNC_CREATE_FRAGMENT,
});

export const asyncMoveFragment = (
  fromColumnID: string,
  fromIndex: number,
  toColumnID: string,
  toIndex: number
): IAsyncMoveFragmentAction => ({
  payload: { fromColumnID, fromIndex, toColumnID, toIndex },
  type: ASYNC_MOVE_FRAGMENT,
});

export const asyncCreateFragmentColumn = (
  board: IBoard,
  title: string
): IAsyncCreateFragmentColumnAction => ({
  payload: { board, title },
  type: ASYNC_CREATE_FRAGMENT_COLUMN,
});

export const asyncRenameFragmentColumn = (
  id: string,
  title: string
): IAsyncRenameFragmentColumnAction => ({
  payload: { id, title },
  type: ASYNC_RENAME_FRAGMENT_COLUMN,
});

export const asyncSaveFragmentColumnsData = (): IAsyncSaveFragmentColumnsDataAction => ({
  payload: undefined,
  type: ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
});

export const setFragmentColumns = (
  columns: IFragmentColumn[]
): ISetFragmentColumnsAction => ({
  payload: { columns },
  type: SET_FRAGMENT_COLUMNS,
});

export const pushFragment = (
  columnID: string,
  fragment: IFragment
): IPushFragmentAction => ({
  payload: { columnID, fragment },
  type: PUSH_FRAGMENT,
});

export const pushFragmentColumn = (
  column: IFragmentColumn
): IPushFragmentColumnAction => ({
  payload: { column },
  type: PUSH_FRAGMENT_COLUMN,
});

export const moveFragment = (
  fromColumnID: string,
  fromIndex: number,
  toColumnID: string,
  toIndex: number,
  newID?: string
): IMoveFragmentAction => ({
  payload: { fromColumnID, fromIndex, toColumnID, toIndex, newID },
  type: MOVE_FRAGMENT,
});

export const moveFragmentColumn = (
  from: number,
  to: number
): IMoveFragmentColumnAction => ({
  payload: { from, to },
  type: MOVE_FRAGMENT_COLUMN,
});

export const renameFragmentColumn = (
  id: string,
  title: string
): IRenameFragmentColumnAction => ({
  payload: { id, title },
  type: RENAME_FRAGMENT_COLUMN,
});
