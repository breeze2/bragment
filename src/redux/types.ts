import Immutable from 'immutable';
import { IBoard, IUnsplashPhoto } from '../api/types';

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
  createDialogVisible: boolean;
  recentList: Immutable.List<IBoard>;
  personalList: Immutable.List<IBoard>;
  standbyBgColors: Immutable.List<string>;
  standbyBgImages: Immutable.List<IUnsplashPhoto>;
}

export type IICommonState = Immutable.Record<ICommonState> &
  Readonly<ICommonState>;
export type IIBoardState = Immutable.Record<IBoardState> &
  Readonly<IBoardState>;

export interface IReduxState {
  common: IICommonState;
  board: IIBoardState;
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
