import { ITimeStamp } from '../firebase/types';

// constants
export const NOTE_CARD_TYPE = 'NOTE';
export const LINK_CARD_TYPE = 'LINK';
export const DEFAULT_CARD_TYPE = NOTE_CARD_TYPE;

export enum EDatabaseErrorMessage {
  BOARD_NOT_EXISTED = 'BOARD_NOT_EXISTED',
  BOARD_EXPIRED_DATA = 'BOARD_EXPIRED_DATA',
  CARD_NOT_EXISTED = 'CARD_NOT_EXISTED',
  COLUMN_NOT_EXISTED = 'COLUMN_NOT_EXISTED',
  COLUMN_EXPIRED_DATA = 'COLUMN_EXPIRED_DATA',
  UNAUTHORIZED = 'UNAUTHORIZED',
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

// interfaces
type IBoardMemberShip = Record<string, EBoardMemberRole>;

export interface IBaseDocument {
  createdAt: ITimeStamp;
  deletedAt?: ITimeStamp;
  updatedAt: ITimeStamp;
}

export interface IBoard extends IBaseDocument {
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
}

export interface IColumn extends IBaseDocument {
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

export interface ICard extends IBaseDocument {
  id: string;
  boardId: string;
  columnId: string;
  userId: string;
  title?: string;
  content?: string;
  files?: ICardFile[];
  image?: string;
  link?: string;
  archived: boolean;
  tags: string[];
  meta?: any;
  type: string;
}
