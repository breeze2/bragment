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

export function getThumbUrl(rawUrl: string) {
  return rawUrl + '&fm=jpg&w=200&fit=max';
}

export function getSmallUrl(rawUrl: string) {
  return rawUrl + '&fm=jpg&w=400&fit=max';
}

export function getRegularUrl(rawUrl: string) {
  return rawUrl + '&fm=jpg&fit=crop&w=1080&q=80&fit=max';
}
