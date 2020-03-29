import {
  asyncCreateDirectory,
  asyncDownloadImage,
  formatFileURL,
  joinPaths,
} from '../utils';
import DexieDB from './DexieDB';
import JsonDB from './JsonDB';
import { DefaultBragmentDB, IBoard, IBragmentDB, IPartial } from './types';

const dexieDB = new DexieDB();

export function getBoardImageURL(board: IBoard) {
  return (
    formatFileURL(joinPaths(board.path, board.image)) + `?t=${board.updated_at}`
  );
}

export function getBoardJsonDBPath(board: IBoard) {
  return joinPaths(board.path, '.brag', 'db.json');
}

// DexieDB
export async function asyncSelectAllBoards() {
  const result = await dexieDB.boards.orderBy('created_at').reverse().toArray();
  return result;
}

export async function asyncFetchBoard(id: number) {
  const result = await dexieDB.boards.get(id);
  return result;
}

export async function asyncUpdateBoard(id: number, changes: IPartial<IBoard>) {
  const result = await dexieDB.boards.update(id, {
    ...changes,
    updated_at: changes.updated_at || Date.now(),
  });
  return result;
}

export async function asyncInsertBoard(board: IBoard) {
  // step1: create dir
  await asyncCreateDirectory(joinPaths(board.path, '.brag'));
  await asyncCreateDirectory(joinPaths(board.path, '.brag', 'assets'));

  // step2: download image
  if (board.image) {
    const background = '.brag/assets/background.jpg';
    await asyncDownloadImage(board.image, joinPaths(board.path, background));
    board.image = background;
  }

  // step3: check existed
  const { path } = board;
  const existed = await dexieDB.boards.get({ path });

  // step4: save in dexie db
  if (existed && existed.id) {
    const now = Date.now();
    await asyncUpdateBoard(existed.id, {
      color: board.color,
      image: board.image,
      title: board.title,
      type: board.type,
      updated_at: now,
    });
    existed.updated_at = now;
    return existed;
  }
  const id = await dexieDB.boards.add(board);
  const result = await dexieDB.boards.get(id);
  return result;
}

// JsonDB
export async function asyncSetBoardLocally(board: IBoard) {
  const file = getBoardJsonDBPath(board);
  const jsonDB = new JsonDB<IBragmentDB>(file, DefaultBragmentDB);
  await jsonDB.update((idata) => {
    return idata.set('board', board);
  });
  await jsonDB.save();
}
