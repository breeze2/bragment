import { asyncCreateDirectory, joinPaths } from '../utils';
import { getBoardJsonDBPath } from './board';
import JsonDB from './JsonDB';
import {
  DefaultBragmentDB,
  IBoard,
  IBragmentDB,
  IFragmentColumn,
} from './types';

export async function asyncBuildFragmentColumn(board: IBoard, title: string) {
  const dir = joinPaths(board.path, title);
  await asyncCreateDirectory(dir);
  const column: IFragmentColumn = {
    archived: false,
    fragments: [],
    title,
  };
  return column;
}

// JsonDB
export async function asyncGetFragmentColumnsLocally(board: IBoard) {
  const file = getBoardJsonDBPath(board);
  const jsonDB = new JsonDB<IBragmentDB>(file, DefaultBragmentDB);
  const idata = await jsonDB.fetch();
  return idata.get('columns');
}

export async function asyncSetFragmentColumnsLocally(
  board: IBoard,
  columns: IFragmentColumn[]
) {
  const file = getBoardJsonDBPath(board);
  const jsonDB = new JsonDB<IBragmentDB>(file, DefaultBragmentDB);
  await jsonDB.update((idata) => {
    return idata.set('columns', columns);
  });
  await jsonDB.save();
}
