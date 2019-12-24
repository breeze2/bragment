import Immutable from 'immutable';

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

export type IICommonState = Immutable.Record<ICommonState> &
  Readonly<ICommonState>;

export interface IReduxState {
  common: IICommonState;
}

export interface IReduxAction<T = any, P = any> {
  payload: P;
  type: T;
}
