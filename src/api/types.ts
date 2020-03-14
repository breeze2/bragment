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
  type: EBoardType;
  checked_at: number;
  created_at: number;
  updated_at: number;
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
