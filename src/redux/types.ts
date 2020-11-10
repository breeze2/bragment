import { EntityState } from '@reduxjs/toolkit';
import {
  EFragmentType,
  IBoard,
  IFragmentCard,
  IFragmentColumn,
  IUnsplashPhoto,
} from '../api/types';

export const AUTHENTICATING = 'AUTHENTICATING';

export enum EAppPage {
  BOARDS = 'BOARDS',
  SETTINGS = 'SETTINGS',
}

export enum EAppTheme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

export enum EFragmentThunkErrorMessage {
  EXISTED_ARCHIVE = 'EXISTED_ARCHIVE',
  EXISTED_COLUMN = 'EXISTED_COLUMN',
  EXISTED_DIRECTORY = 'EXISTED_DIRECTORY',
  EXISTED_FILE = 'EXISTED_FILE',
  UNKNOWN = 'UNKNOWN',
}

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
  standbyBgColors: string[];
  standbyBgImages: IUnsplashPhoto[];
}

export type IBoardState = EntityState<IBoard> & IBoardsExtraState;

export interface IFragmentColumnExtraState {
  currentId?: string;
  loading: boolean;
}

export type IFragmentCardState = EntityState<IFragmentCard> &
  IFragmentCardExtraState;

export interface IFragmentCardExtraState {
  createAsType: EFragmentType;
  createDialogVisible: boolean;
  createForColumnId?: string;
  currentId?: string;
  loading: boolean;
}

export type IFragmentColumnState = EntityState<IFragmentColumn> &
  IFragmentColumnExtraState;

export interface IReduxState {
  board: IBoardState;
  common: ICommonState;
  fragmentColumn: IFragmentColumnState;
  fragmentCard: IFragmentCardState;
  user: IUserState;
}
