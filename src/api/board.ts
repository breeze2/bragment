import {
  asyncCopyImage,
  asyncCreateDirectory,
  formatFileURL,
  joinPaths,
} from '../utils';
import db from './dexie';
import { IBoard, IPartial } from './types';

export function getBoardImageURL(board: IBoard) {
  return formatFileURL(joinPaths(board.path, board.image));
}

export async function asyncSelectAllBoards() {
  const result = await db.boards
    .orderBy('created_at')
    .reverse()
    .toArray();
  return result;
}

export async function asyncFetchBoard(id: number) {
  const result = await db.boards.get(id);
  return result;
}

export async function asyncUpdateBoard(id: number, changes: IPartial<IBoard>) {
  const result = await db.boards.update(id, {
    ...changes,
    updated_at: Date.now(),
  });
  return result;
}

export async function asyncInsertNewBoard(board: IBoard) {
  // step1: create dir
  await asyncCreateDirectory(joinPaths(board.path, '.brag'));
  await asyncCreateDirectory(joinPaths(board.path, '.brag', 'assets'));

  // step2: download image
  if (board.image) {
    const background = '.brag/assets/background.jpg';
    await asyncCopyImage(board.image, joinPaths(board.path, background));
    board.image = background;
  }

  // step3: check existed
  const { path } = board;
  const existed = await db.boards.get({ path });

  // step4: save in dexie db
  if (existed && existed.id) {
    asyncUpdateBoard(existed.id, {
      color: board.color,
      image: board.image,
      title: board.title,
      type: board.type,
    });
    return existed;
  }
  const id = await db.boards.add(board);
  const result = await db.boards.get(id);
  return result;
}
