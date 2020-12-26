import firebase from 'firebase';

// constants
export enum EDatabaseErrorMessage {
  BOARD_NOT_EXISTED = 'BOARD_NOT_EXISTED',
  BOARD_EXPIRED_DATA = 'BOARD_EXPIRED_DATA',
  CARD_NOT_EXISTED = 'CARD_NOT_EXISTED',
  COLUMN_NOT_EXISTED = 'COLUMN_NOT_EXISTED',
  COLUMN_EXPIRED_DATA = 'COLUMN_EXPIRED_DATA',
  UNKNOWN = 'UNKNOWN',
}

export enum EDataTable {
  BOARD = 'boards',
  CARD = 'cards',
  COLUMN = 'columns',
}

export enum EBoardType {
  GROUP = 'GROUP',
  PERSONAL = 'PERSONAL',
}

export enum EBoardPolicy {
  PRIVATE = 'PRIVATE',
  PROTECTED = 'PROTECTED',
  PUBLIC = 'PUBLIC',
}

export enum EBoardMemberRole {
  OWNER = 'OWNER',
  NORMAL = 'NORMAL',
}

export enum ECardType {
  GIST = 'GIST',
  LINK = 'LINK',
  NOTE = 'NOTE',
  POST = 'POST',
  TODO = 'TODO',
}

// interfaces
export type IFieldValueMap = {
  [key: string]: firebase.firestore.FieldValue;
};

export type IUpdateDataGroup<T> = {
  id: string;
  data: Partial<T> | IFieldValueMap;
}[];

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

type IBoardMemberShip = Record<string, EBoardMemberRole>;

export interface IBoard {
  id: string;
  title: string;
  userId: string;
  groupId?: string;
  color?: string;
  image?: string;
  columnOrder: string[];
  memberShip: IBoardMemberShip;
  archived: boolean;
  type: EBoardType;
  policy: EBoardPolicy;
  createdAt: ITimeStamp;
  deletedAt?: ITimeStamp;
  updatedAt: ITimeStamp;
}

export interface IColumn {
  id: string;
  title: string;
  boardId: string;
  userId: string;
  cardOrder: string[];
  archived: boolean;
}

export interface ICardFile {
  name: string;
  content: string;
}

export interface ICard {
  id: string;
  title: string;
  boardId: string;
  columnId: string;
  userId: string;
  files?: ICardFile[];
  image?: string;
  link?: string;
  archived: boolean;
  tags: string[];
  type: ECardType;
}
