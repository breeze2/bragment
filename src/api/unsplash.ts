import Unsplash, { toJson } from 'unsplash-js';
import { IUnsplashPhoto } from './types';

const unsplash = new Unsplash({
  accessKey: 'c74a14663141cce0f901fdc3cb99c1a2c49ada0f4910c96e7f99079afd3c595f',
  secret: '',
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
