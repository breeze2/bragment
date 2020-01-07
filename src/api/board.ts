import { asyncCopyImage, asyncCreateDirectory, joinPaths } from '../utils';
import db from './dexie';
import { IBoard } from './types';

export async function asyncSelectAllBoards() {
  const result = await db.boards
    .orderBy('created_at')
    .reverse()
    .toArray();
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

  // 3. check existed
  const { path } = board;
  const existed = await db.boards.get({ path });

  // 4. save in dexie db
  if (existed && existed.id) {
    await db.boards.update(existed.id, {
      color: board.color,
      image: board.image,
      title: board.title,
      updated_at: board.updated_at,
    });
    return existed;
  }
  const id = await db.boards.add(board);
  const result = await db.boards.get(id);
  return result;
}
