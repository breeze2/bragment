import { createApi } from 'unsplash-js';
import { IUnsplashPhoto } from './types';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESSKEY || '',
});

export async function getRandomPhoto(count = 4) {
  try {
    const result = await unsplash.photos.getRandom({
      count,
      collectionIds: ['wallpapers'],
      query: 'desktop',
    });
    const photos: IUnsplashPhoto[] = result.response as any;
    return photos;
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
