import { EntityState } from '@reduxjs/toolkit';
import {
  ECardType,
  IBoard,
  ICard,
  IColumn,
  IUnsplashPhoto,
} from '../api/types';

// constants
export const AUTHENTICATING = 'AUTHENTICATING';
export const APP_HEADER_HEIGHT = 48;
export const COLUMN_WIDTH = 266;
export const COLUMN_CONTENT_PADDING_TOP = 6;

export enum EAppRoute {
  BOARDS = '/boards',
  SETTINGS = '/settings',
  HOME = '/',
  BOARD = '/board/:id',
}

export enum EAppTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export enum EReduxThunkErrorMessage {
  EXISTED_ARCHIVE = 'EXISTED_ARCHIVE',
  EXISTED_COLUMN = 'EXISTED_COLUMN',
  EXISTED_FILE = 'EXISTED_FILE',
  UNKNOWN = 'UNKNOWN',
}

// interfaces
export interface ICommonState {
  language: string;
  onLine: boolean;
  theme: EAppTheme;
}

export interface IUserProfile {
  displayName?: string;
  photoUrl?: string;
  email?: string;
  emailVerified: boolean;
  uid: string;
}

export interface IUserState {
  currentId?: string;
  currentProfile?: IUserProfile;
  signInDialogVisible: boolean;
}

export interface IBoardsExtraState {
  createDialogVisible: boolean;
  currentId?: string;
  loading: boolean;
  recentBoardIds: string[];
  standbyBgColors: string[];
  standbyBgImages: IUnsplashPhoto[];
}

export type IBoardState = EntityState<IBoard> & IBoardsExtraState;

export interface IColumnExtraState {
  currentId?: string;
  loading: boolean;
}

export type ICardState = EntityState<ICard> & ICardExtraState;

export interface ICardExtraState {
  createAsType: ECardType;
  createDialogVisible: boolean;
  createForColumnId?: string;
  currentId?: string;
  loading: boolean;
}

export type IColumnState = EntityState<IColumn> & IColumnExtraState;

export interface IReduxState {
  board: IBoardState;
  common: ICommonState;
  column: IColumnState;
  card: ICardState;
  user: IUserState;
}
