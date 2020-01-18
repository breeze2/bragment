import * as fs from 'fs';
import * as path from 'path';
import request from 'request-promise-native';
import * as url from 'url';

export function getPathBasename(dir: string) {
  return path.basename(dir);
}

export function joinPaths(...dirs: string[]) {
  return path.join(...dirs);
}

export function formatFileUrl(pathname: string) {
  return url.format({
    pathname,
    protocol: 'file',
    slashes: true,
  });
}

export function asyncCreateDirectory(dir: string) {
  return fs.promises.mkdir(dir, { recursive: true }).catch(err => {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }
    // TODO: send to sentry
    console.error(err);
  });
}

export async function asyncCopyImage(source: string, destination: string) {
  let body: Buffer | undefined;
  try {
    if (source.substr(0, 4) === 'http') {
      // download from server
      body = await request({
        encoding: null,
        method: 'GET',
        uri: source,
      });
    } else {
      // read from local
      // TODO:
    }
    if (body) {
      await fs.promises.writeFile(destination, body, 'binary');
    }
  } catch (err) {
    // TODO: send to sentry
    console.error(err);
  }
}
