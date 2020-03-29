import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

export function getPathBasename(dir: string) {
  return path.basename(dir);
}

export function joinPaths(...dirs: string[]) {
  return path.join(...dirs);
}

export function formatFileURL(pathname: string) {
  return url.format({
    pathname,
    protocol: 'file',
    slashes: true,
  });
}

export function checkFileExisted(pathname: string) {
  return fs.existsSync(pathname);
}

export function asyncStatFile(pathname: string) {
  return fs.promises.stat(pathname);
}

export function asyncCreateDirectory(dir: string) {
  return fs.promises.mkdir(dir, { recursive: true }).catch((err) => {
    if (err && err.code !== 'EEXIST') {
      throw err;
    }
    // TODO: send to sentry
    console.error(err);
  });
}

export async function asyncRenameFile(oldPath: string, newPath: string) {
  return fs.promises.rename(oldPath, newPath);
}

export async function asyncDownloadImage(
  source: string,
  destination: string,
  neverThrow = true
) {
  try {
    const response = await fetch(source);
    const ab = await response.arrayBuffer();
    await fs.promises.writeFile(destination, Buffer.from(ab), 'binary');
  } catch (err) {
    // TODO: send to sentry
    if (neverThrow) {
      console.error(err);
    } else {
      throw err;
    }
  }
}
