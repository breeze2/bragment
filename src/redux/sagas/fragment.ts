import Immutable from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  asyncBuildFragmentColumn,
  asyncSetFragmentColumnsLocally,
} from '../../api/fragment';
import { IBoard, IFragmentColumn } from '../../api/types';
import { asyncRenameFile, checkFileExisted, joinPaths } from '../../utils';
import {
  ASYNC_CREATE_FRAGMENT_COLUMN,
  ASYNC_RENAME_FRAGMENT_COLUMN,
  ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
  EFragmentActionError,
  IAsyncCreateFragmentColumnAction,
  IAsyncRenameFragmentColumnAction,
  pushFragmentColumn,
  renameFragmentColumn,
} from '../actions';
import { makeSagaWorkerDispatcher } from './helpers';
import { getCurrentBoard, getFragmentColumns } from './selectors';

function* createFragmentColumnSaga(action: IAsyncCreateFragmentColumnAction) {
  const { board, title } = action.payload;
  const column = yield call(asyncBuildFragmentColumn, board, title);
  yield put(pushFragmentColumn(column));
  return column;
}

function* renameFragmentColumnSaga(action: IAsyncRenameFragmentColumnAction) {
  const board: IBoard | null = yield select(getCurrentBoard);
  const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
    getFragmentColumns
  );
  if (!board || !fragmentColumns) {
    return;
  }
  const { oldTitle, newTitle } = action.payload;
  const oldPath = joinPaths(board.path, oldTitle);
  const newPath = joinPaths(board.path, newTitle);
  const existedColumn = fragmentColumns.find(
    (column) => column.title === newTitle
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
  yield put(renameFragmentColumn(oldTitle, newTitle));
}

function* saveFragmentColumnsDataSaga() {
  const board: IBoard | null = yield select(getCurrentBoard);
  const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
    getFragmentColumns
  );
  if (board) {
    yield call(
      asyncSetFragmentColumnsLocally,
      board,
      fragmentColumns.toArray()
    );
  }
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_FRAGMENT_COLUMN]: createFragmentColumnSaga,
  [ASYNC_RENAME_FRAGMENT_COLUMN]: renameFragmentColumnSaga,
  [ASYNC_SAVE_FRAGMENT_COLUMNS_DATA]: saveFragmentColumnsDataSaga,
});

export function* watchFragmentSagas() {
  yield takeEvery(
    [
      ASYNC_CREATE_FRAGMENT_COLUMN,
      ASYNC_RENAME_FRAGMENT_COLUMN,
      ASYNC_SAVE_FRAGMENT_COLUMNS_DATA,
    ],
    dispatcher
  );
}
