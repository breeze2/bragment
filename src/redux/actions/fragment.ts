import {
  EFragmentType,
  IFragmentCard,
  IFragmentColumn,
  IPartial,
} from '../../api/types';
import { IReduxAction } from '../types';

export enum EFragmentActionError {
  EXISTED_ARCHIVE,
  EXISTED_DIRECTORY,
  EXISTED_FILE,
  UNKNOWN,
}

export const ASYNC_CREATE_FRAGMENT_CARD = 'ASYNC_CREATE_FRAGMENT_CARD';
export const ASYNC_CREATE_FRAGMENT_COLUMN = 'ASYNC_CREATE_FRAGMENT_COLUMN';
export const ASYNC_MOVE_FRAGMENT_CARD = 'ASYNC_MOVE_FRAGMENT_CARD';
export const ASYNC_MOVE_FRAGMENT_COLUMN = 'ASYNC_MOVE_FRAGMENT_COLUMN';
export const ASYNC_RENAME_FRAGMENT_COLUMN = 'ASYNC_RENAME_FRAGMENT_COLUMN';
export const HIDE_CREATE_FRAGMENT_DIALOG = 'HIDE_CREATE_FRAGMENT_DIALOG';
export const SHOW_CREATE_FRAGMENT_DIALOG = 'SHOW_CREATE_FRAGMENT_DIALOG';
export const SET_CURRENT_FRAGMENT = 'SET_CURRENT_FRAGMENT';
export const SET_FRAGMENT_CARD_MAP = 'SET_FRAGMENT_CARD_MAP';
export const SET_FRAGMENT_COLUMN_MAP = 'SET_FRAGMENT_COLUMN_MAP';
export const SET_FRAGMENT_LOADING = 'SET_FRAGMENT_LOADING';
export const PUSH_FRAGMENT_CARD = 'PUSH_FRAGMENT_CARD';
export const PUSH_FRAGMENT_COLUMN = 'PUSH_FRAGMENT_COLUMN';
export const MOVE_FRAGMENT_CARD = 'MOVE_FRAGMENT_CARD';
export const MOVE_FRAGMENT_COLUMN = 'MOVE_FRAGMENT_COLUMN';
export const RENAME_FRAGMENT_COLUMN = 'RENAME_FRAGMENT_COLUMN';

export type ISetFragmentCardMapAction = IReduxAction<
  typeof SET_FRAGMENT_CARD_MAP,
  {
    cardMap: Map<string, IFragmentCard>;
  }
>;

export type ISetFragmentColumnMapAction = IReduxAction<
  typeof SET_FRAGMENT_COLUMN_MAP,
  {
    columnMap: Map<string, IFragmentColumn>;
  }
>;

export type IShowCreateFragmentDialogAction = IReduxAction<
  typeof SHOW_CREATE_FRAGMENT_DIALOG,
  { columnId: string; type: EFragmentType }
>;

export type IHideCreateFragmentDialogAction = IReduxAction<
  typeof HIDE_CREATE_FRAGMENT_DIALOG,
  void
>;

export type ISetCurrentFragmentAction = IReduxAction<
  typeof SET_CURRENT_FRAGMENT,
  { current: IFragmentCard | null }
>;

export type ISetFragmentLoadingAction = IReduxAction<
  typeof SET_FRAGMENT_LOADING,
  { loading: boolean }
>;

export type IPushFragmentCardAction = IReduxAction<
  typeof PUSH_FRAGMENT_CARD,
  { columnId: string; card: IFragmentCard }
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

export type IMoveFragmentCardAction = IReduxAction<
  typeof MOVE_FRAGMENT_CARD,
  {
    fromColumnId: string;
    fromId: string;
    toColumnId: string;
    toId?: string;
  }
>;

export type IRenameFragmentColumnAction = IReduxAction<
  typeof RENAME_FRAGMENT_COLUMN,
  {
    id: string;
    title: string;
  }
>;

export type IAsyncCreateFragmentCardAction = IReduxAction<
  typeof ASYNC_CREATE_FRAGMENT_CARD,
  {
    boardId: string;
    columnId: string;
    title: string;
    others?: IPartial<IFragmentCard>;
  }
>;

export type IAsyncMoveFragmentCardAction = IReduxAction<
  typeof ASYNC_MOVE_FRAGMENT_CARD,
  {
    fromColumnId: string;
    fromId: string;
    toColumnId: string;
    toId?: string;
  }
>;

export type IAsyncCreateFragmentColumnAction = IReduxAction<
  typeof ASYNC_CREATE_FRAGMENT_COLUMN,
  { boardId: string; title: string }
>;

export type IAsyncRenameFragmentColumnAction = IReduxAction<
  typeof ASYNC_RENAME_FRAGMENT_COLUMN,
  { id: string; title: string }
>;

export type IAsyncMoveFragmentColumnAction = IReduxAction<
  typeof ASYNC_MOVE_FRAGMENT_COLUMN,
  { fromId: string; toId?: string }
>;

export type IFragmentAction =
  | IAsyncCreateFragmentCardAction
  | IAsyncCreateFragmentColumnAction
  | IAsyncMoveFragmentCardAction
  | IAsyncMoveFragmentColumnAction
  | IAsyncRenameFragmentColumnAction
  | IPushFragmentCardAction
  | IMoveFragmentCardAction
  | IPushFragmentColumnAction
  | IMoveFragmentColumnAction
  | IRenameFragmentColumnAction
  | IShowCreateFragmentDialogAction
  | IHideCreateFragmentDialogAction
  | ISetCurrentFragmentAction
  | ISetFragmentCardMapAction
  | ISetFragmentColumnMapAction
  | ISetFragmentLoadingAction;

export const asyncCreateFragment = (
  boardId: string,
  columnId: string,
  title: string,
  others?: IPartial<IFragmentCard>
): IAsyncCreateFragmentCardAction => ({
  payload: { boardId, columnId, title, others },
  type: ASYNC_CREATE_FRAGMENT_CARD,
});

export const asyncMoveFragmentCard = (
  fromColumnId: string,
  fromId: string,
  toColumnId: string,
  toId?: string
): IAsyncMoveFragmentCardAction => ({
  payload: { fromColumnId, fromId, toColumnId, toId },
  type: ASYNC_MOVE_FRAGMENT_CARD,
});

export const asyncCreateFragmentColumn = (
  boardId: string,
  title: string
): IAsyncCreateFragmentColumnAction => ({
  payload: { boardId, title },
  type: ASYNC_CREATE_FRAGMENT_COLUMN,
});

export const asyncRenameFragmentColumn = (
  id: string,
  title: string
): IAsyncRenameFragmentColumnAction => ({
  payload: { id, title },
  type: ASYNC_RENAME_FRAGMENT_COLUMN,
});

export const asyncMoveFragmentColumn = (
  fromId: string,
  toId: string
): IAsyncMoveFragmentColumnAction => ({
  payload: { fromId, toId },
  type: ASYNC_MOVE_FRAGMENT_COLUMN,
});

export const showCreateFragmentDialog = (
  columnId: string,
  type: EFragmentType
): IShowCreateFragmentDialogAction => ({
  payload: { columnId, type },
  type: SHOW_CREATE_FRAGMENT_DIALOG,
});

export const hideCreateFragmentDialog = (): IHideCreateFragmentDialogAction => ({
  payload: undefined,
  type: HIDE_CREATE_FRAGMENT_DIALOG,
});

export const setCurrentFragment = (
  current: IFragmentCard | null
): ISetCurrentFragmentAction => ({
  payload: { current },
  type: SET_CURRENT_FRAGMENT,
});

export const setFragmentCardMap = (
  cardMap: Map<string, IFragmentCard>
): ISetFragmentCardMapAction => ({
  payload: { cardMap },
  type: SET_FRAGMENT_CARD_MAP,
});

export const setFragmentColumnMap = (
  columnMap: Map<string, IFragmentColumn>
): ISetFragmentColumnMapAction => ({
  payload: { columnMap },
  type: SET_FRAGMENT_COLUMN_MAP,
});

export const setFragmentLoading = (
  loading: boolean
): ISetFragmentLoadingAction => ({
  payload: { loading },
  type: SET_FRAGMENT_LOADING,
});

export const pushFragmentCard = (
  columnId: string,
  card: IFragmentCard
): IPushFragmentCardAction => ({
  payload: { columnId, card },
  type: PUSH_FRAGMENT_CARD,
});

export const pushFragmentColumn = (
  column: IFragmentColumn
): IPushFragmentColumnAction => ({
  payload: { column },
  type: PUSH_FRAGMENT_COLUMN,
});

export const moveFragmentCard = (
  fromColumnId: string,
  fromId: string,
  toColumnId: string,
  toId?: string
): IMoveFragmentCardAction => ({
  payload: { fromColumnId, fromId, toColumnId, toId },
  type: MOVE_FRAGMENT_CARD,
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
