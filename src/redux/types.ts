import Immutable from 'immutable';
import {
  EFragmentType,
  IBoard,
  IFragmentCard,
  IFragmentColumn,
  IUnsplashPhoto,
} from '../api/types';

export enum EAppPage {
  BOARDS = 'BOARDS',
  SETTINGS = 'SETTINGS',
}

export enum EAppTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export interface ICommonState {
  language: string;
  onLine: boolean;
  signInDialogVisible: boolean;
  theme: EAppTheme;
}

export interface IBoardState {
  createDialogVisible: boolean;
  current: IBoard | null;
  groupList: Immutable.List<IBoard>;
  loading: boolean;
  personalList: Immutable.List<IBoard>;
  recentList: Immutable.List<IBoard>;
  standbyBgColors: Immutable.List<string>;
  standbyBgImages: Immutable.List<IUnsplashPhoto>;
}

export interface IFragmentState {
  cardMap: Immutable.Map<string, IFragmentCard>;
  columnMap: Immutable.Map<string, IFragmentColumn>;
  createDialogVisible: boolean;
  createType: EFragmentType;
  current: IFragmentCard | null;
  currentColumnId: string;
  loading: boolean;
}

export type IICommonState = Immutable.Record<ICommonState> &
  Readonly<ICommonState>;
export type IIBoardState = Immutable.Record<IBoardState> &
  Readonly<IBoardState>;
export type IIFragmentState = Immutable.Record<IFragmentState> &
  Readonly<IFragmentState>;

export interface IReduxState {
  common: IICommonState;
  board: IIBoardState;
  fragment: IIFragmentState;
}

export interface IReduxAction<T = any, P = any> {
  payload: P;
  type: T;
}

export interface IReduxAsyncAction<T = any, P = any, R = any, E = any>
  extends IReduxAction<T, P> {
  resolve: (value?: R | PromiseLike<R> | undefined) => void;
  reject: (reason?: E) => void;
}
