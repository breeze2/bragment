import Unsplash, { toJson } from 'unsplash-js';
import { IUnsplashPhoto } from './types';

const unsplash = new Unsplash({
  accessKey: process.env.UNSPLASH_ACCESSKEY || '',
  secret: process.env.UNSPLASH_SECRET || '',
});

export async function getRandomPhoto(count: number = 4) {
  try {
    const response = await unsplash.photos.getRandomPhoto({
      count,
      query: 'desktop wallpapers',
    });
    const photoes: IUnsplashPhoto[] = toJson(response);
    return photoes;
  } catch (err) {
    // TODO: send to sentry
    console.error(err);
    return [];
  }
}
