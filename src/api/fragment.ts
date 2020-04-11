import shortid from 'shortid';
import { asyncCreateDirectory, asyncCreateFile, joinPaths } from '../utils';
import { getBoardJsonDBPath } from './board';
import JsonDB from './JsonDB';
import {
  DefaultBragmentDB,
  EFragmentType,
  IBoard,
  IBragmentDB,
  IFragment,
  IFragmentColumn,
} from './types';

function getFragmentExtensionByType(type: EFragmentType) {
  switch (type) {
    case EFragmentType.GIST:
      return '.gist.json';
    default:
      return '.md';
  }
}

export function generateFragmentID() {
  return shortid.generate();
}

export function getFragmentPath(
  board: IBoard,
  columnID: string,
  fragment: IFragment
) {
  return joinPaths(
    board.path,
    columnID,
    `${fragment.id}${getFragmentExtensionByType(fragment.type)}`
  );
}

export async function asyncBuildFragment(
  board: IBoard,
  columnID: string,
  title: string,
  type: EFragmentType,
  tags?: string[]
) {
  const id = generateFragmentID();
  const fragment: IFragment = {
    id,
    archived: false,
    title,
    type,
    tags: tags || [],
  };
  const pathname = getFragmentPath(board, columnID, fragment);
  await asyncCreateFile(pathname);
  return fragment;
}

export async function asyncBuildFragmentColumn(
  board: IBoard,
  id: string,
  title: string
) {
  const dir = joinPaths(board.path, title);
  await asyncCreateDirectory(dir);
  const column: IFragmentColumn = {
    archived: false,
    fragments: [],
    id,
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

export async function asyncSaveFragmentColumnsLocally(
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
