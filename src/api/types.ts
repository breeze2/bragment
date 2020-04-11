export type IPartial<T> = {
  [P in keyof T]?: T[P];
};

export enum EBoardType {
  COMPANY = 'COMPANY',
  GROUP = 'GROUP',
  PERSON = 'PERSON',
}

export interface IBoard {
  id?: number;
  path: string;
  title: string;
  color: string;
  image: string;
  archived: boolean;
  type: EBoardType;
  checked_at: number;
  created_at: number;
  updated_at: number;
}

export enum EFragmentType {
  GIST = 'GIST',
  LINK = 'LINK',
  POST = 'POST',
  TODO = 'TODO',
}

export interface IFragment {
  id: string;
  title: string;
  archived: boolean;
  tags: string[];
  type: EFragmentType;
}

export interface IFragmentColumn {
  id: string;
  title: string;
  fragments: IFragment[];
  archived: boolean;
}

export interface IUnsplashPhoto {
  id: string;
  color: string;
  links: {
    download: string;
  };
  urls: {
    full: string;
    small: string;
    thumb: string;
    regular: string;
  };
}

export interface IBragmentDB {
  version: '1.0.0';
  board: IBoard;
  columns: IFragmentColumn[];
}

export const DefaultBragmentDB: IBragmentDB = {
  version: '1.0.0',
  board: {
    path: '',
    title: '',
    color: '',
    image: '',
    archived: false,
    type: EBoardType.PERSON,
    checked_at: 0,
    created_at: 0,
    updated_at: 0,
  },
  columns: [],
};
