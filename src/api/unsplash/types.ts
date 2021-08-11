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
