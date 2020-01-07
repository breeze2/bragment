export interface IBoard {
  id?: number;
  path: string;
  title: string;
  color: string;
  image: string;
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
