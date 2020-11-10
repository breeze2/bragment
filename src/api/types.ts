import firebase from 'firebase';

export enum EFirestoreErrorMessage {
  BOARD_NOT_EXISTED = 'BOARD_NOT_EXISTED',
  BOARD_EXPIRED_DATA = 'BOARD_EXPIRED_DATA',
  FRAGMENT_CARD_NOT_EXISTED = 'FRAGMENT_CARD_NOT_EXISTED',
  FRAGMENT_COLUMN_NOT_EXISTED = 'FRAGMENT_COLUMN_NOT_EXISTED',
  FRAGMENT_COLUMN_EXPIRED_DATA = 'FRAGMENT_COLUMN_EXPIRED_DATA',
  UNKNOWN = 'UNKNOWN',
}

export type IFieldValueMap = {
  [key: string]: firebase.firestore.FieldValue;
};

export type IUpdateDataGroup<T> = {
  id: string;
  data: Partial<T> | IFieldValueMap;
}[];

export enum EBoardType {
  GROUP = 'GROUP',
  PERSONAL = 'PERSONAL',
}

export enum EBoardPolicy {
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  PUBLIC = 'PUBLIC',
}

export enum EFragmentType {
  GIST = 'GIST',
  LINK = 'LINK',
  NOTE = 'NOTE',
  POST = 'POST',
  TODO = 'TODO',
}

export enum EFragmentTypeColor {
  GIST = '#722ed1',
}

export interface IUnsplashPhoto {
  id: string;
  color: string;
  links: {
    download: string;
  };
  urls: {
    raw: string;
    full: string;
    small: string;
    thumb: string;
    regular: string;
  };
}

type ITimeStamp =
  | number
  | firebase.firestore.Timestamp
  | firebase.firestore.FieldValue;
export interface IBoard {
  id: string;
  title: string;
  userId: string;
  groupId?: string;
  color?: string;
  image?: string;
  columnOrder: string[];
  archived: boolean;
  type: EBoardType;
  policy: EBoardPolicy;
  checkedAt: ITimeStamp;
  createdAt: ITimeStamp;
  updatedAt: ITimeStamp;
}

export interface IFragmentColumn {
  id: string;
  title: string;
  boardId: string;
  userId: string;
  cardOrder: string[];
  archived: boolean;
}

export interface IFragmentFile {
  name: string;
  content: string;
}

export interface IFragmentCard {
  id: string;
  title: string;
  boardId: string;
  columnId: string;
  userId: string;
  files?: IFragmentFile[];
  image?: string;
  link?: string;
  archived: boolean;
  tags: string[];
  type: EFragmentType;
}
