import Immutable from 'immutable';
import { IBoard, IFragmentColumn, IUnsplashPhoto } from '../api/types';

export enum EAppPages {
  BOARDS = 'BOARDS',
  SETTINGS = 'SETTINGS',
}

export enum EAppThemes {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export interface ICommonState {
  language: string;
  onLine: boolean;
  theme: EAppThemes;
}

export interface IBoardState {
  all: Immutable.List<IBoard>;
  createDialogVisible: boolean;
  current: IBoard | null;
  recentList: Immutable.List<IBoard>;
  personalList: Immutable.List<IBoard>;
  standbyBgColors: Immutable.List<string>;
  standbyBgImages: Immutable.List<IUnsplashPhoto>;
}

export interface IFragmentState {
  columns: Immutable.List<IFragmentColumn>;
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
