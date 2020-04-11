import Immutable from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  asyncBuildFragment,
  asyncBuildFragmentColumn,
  asyncSaveFragmentColumnsLocally,
  generateFragmentID,
  getFragmentPath,
} from '../../api/fragment';
import { IBoard, IFragmentColumn } from '../../api/types';
import {
  // asyncMoveFile,
  asyncRenameFile,
  checkFileExisted,
  joinPaths,
  moveFile,
} from '../../utils';
import {
  ASYNC_CREATE_FRAGMENT,
  ASYNC_CREATE_FRAGMENT_COLUMN,
  ASYNC_MOVE_FRAGMENT,
  ASYNC_RENAME_FRAGMENT_COLUMN,
  ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
  EFragmentActionError,
  IAsyncCreateFragmentAction,
  IAsyncCreateFragmentColumnAction,
  IAsyncMoveFragmentAction,
  IAsyncRenameFragmentColumnAction,
  moveFragment,
  pushFragment,
  pushFragmentColumn,
  renameFragmentColumn,
} from '../actions';
import { makeSagaWorkerDispatcher } from './helpers';
import { getCurrentBoard, getFragmentColumns } from './selectors';

function* createFragmentSaga(action: IAsyncCreateFragmentAction) {
  const currentBoard: IBoard | null = yield select(getCurrentBoard);
  const { board, columnID, title, tags, type } = action.payload;
  const fragment = yield call(
    asyncBuildFragment,
    board,
    columnID,
    title,
    type,
    tags
  );
  if (currentBoard && board === currentBoard) {
    yield put(pushFragment(columnID, fragment));
  } else {
    // TODO: update fragment columns data locally
  }
  return fragment;
}

function* createFragmentColumnSaga(action: IAsyncCreateFragmentColumnAction) {
  const currentBoard: IBoard | null = yield select(getCurrentBoard);
  const { board, title } = action.payload;
  // TODO: generate id
  const id = title;
  const column = yield call(asyncBuildFragmentColumn, board, id, title);
  if (currentBoard && currentBoard === board) {
    yield put(pushFragmentColumn(column));
  } else {
    // TODO: update fragment columns data locally
  }
  return column;
}

function* moveFragmentSaga(action: IAsyncMoveFragmentAction) {
  const board: IBoard | null = yield select(getCurrentBoard);
  const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
    getFragmentColumns
  );
  const { fromColumnID, fromIndex, toColumnID, toIndex } = action.payload;
  if (
    !board ||
    !fragmentColumns ||
    (fromColumnID === toColumnID && fromIndex === toIndex)
  ) {
    return;
  }
  const fromColumn = fragmentColumns.find(
    (column) => column.id === fromColumnID
  );
  const toColumn = fragmentColumns.find((column) => column.id === toColumnID);
  const fromFragment = fromColumn?.fragments[fromIndex];
  if (!fromColumn || !toColumn || !fromFragment) {
    return;
  }
  let newID: string | undefined;
  if (fromColumnID !== toColumnID) {
    const oldPath = getFragmentPath(board, fromColumnID, fromFragment);
    let newPath = getFragmentPath(board, toColumnID, fromFragment);
    // TODO: should check destination existed
    if (
      checkFileExisted(newPath) ||
      toColumn.fragments.some((fragment) => fragment.id === fromFragment.id)
    ) {
      newID = generateFragmentID();
      newPath = getFragmentPath(board, toColumnID, {
        ...fromFragment,
        id: newID,
      });
    }
    // NOTE: move file synchronously to block dom updating
    // yield call(asyncMoveFile, oldPath, newPath);
    moveFile(oldPath, newPath);
  }
  yield put(moveFragment(fromColumnID, fromIndex, toColumnID, toIndex, newID));
  return;
}

function* renameFragmentColumnSaga(action: IAsyncRenameFragmentColumnAction) {
  const board: IBoard | null = yield select(getCurrentBoard);
  const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
    getFragmentColumns
  );
  if (!board || !fragmentColumns) {
    return;
  }
  const { id, title } = action.payload;
  const oldPath = joinPaths(board.path, id);
  const newPath = joinPaths(board.path, title);
  const existedColumn = fragmentColumns.find(
    (column) => column.title === title
  );
  if (existedColumn) {
    throw existedColumn.archived
      ? EFragmentActionError.EXISTED_ARCHIVE
      : EFragmentActionError.EXISTED_DIRECTORY;
  }
  if (checkFileExisted(newPath)) {
    throw EFragmentActionError.EXISTED_FILE;
  }
  yield call(asyncRenameFile, oldPath, newPath);
  yield put(renameFragmentColumn(id, title));
}

function* saveFragmentColumnsDataSaga() {
  const board: IBoard | null = yield select(getCurrentBoard);
  const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
    getFragmentColumns
  );
  if (board) {
    yield call(
      asyncSaveFragmentColumnsLocally,
      board,
      fragmentColumns.toArray()
    );
  }
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_FRAGMENT]: createFragmentSaga,
  [ASYNC_CREATE_FRAGMENT_COLUMN]: createFragmentColumnSaga,
  [ASYNC_MOVE_FRAGMENT]: moveFragmentSaga,
  [ASYNC_RENAME_FRAGMENT_COLUMN]: renameFragmentColumnSaga,
  [ASYNC_SAVE_FRAGMENT_COLUMNS_DATA]: saveFragmentColumnsDataSaga,
});

export function* watchFragmentSagas() {
  yield takeEvery(
    [
      ASYNC_CREATE_FRAGMENT,
      ASYNC_CREATE_FRAGMENT_COLUMN,
      ASYNC_MOVE_FRAGMENT,
      ASYNC_RENAME_FRAGMENT_COLUMN,
      ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
    ],
    dispatcher
  );
}
