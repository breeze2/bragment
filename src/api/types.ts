import { firestore } from 'firebase/index';

export type IPartial<T> = {
  [P in keyof T]?: T[P];
};

export type IFieldValueMap = {
  [key: string]: firestore.FieldValue;
};

export type IUpdateDataGroup<T> = {
  id: string;
  data: IPartial<T> | IFieldValueMap;
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
  checkedAt: firestore.Timestamp | firestore.FieldValue;
  createdAt: firestore.Timestamp | firestore.FieldValue;
  updatedAt: firestore.Timestamp | firestore.FieldValue;
  lastCheckedAt?: number;
}

export interface IFragmentCard {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  image?: string;
  link?: string;
  archived: boolean;
  tags: string[];
  type: EFragmentType;
}

export interface IFragmentColumn {
  id: string;
  boardId: string;
  title: string;
  cardOrder: string[];
  archived: boolean;
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
