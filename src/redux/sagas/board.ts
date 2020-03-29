import Immutable from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  asyncFetchBoard,
  asyncInsertBoard,
  asyncSelectAllBoards,
  asyncSetBoardLocally,
  asyncUpdateBoard,
} from '../../api/board';
import { asyncGetFragmentColumnsLocally } from '../../api/fragment';
import { IBoard, IFragmentColumn, IUnsplashPhoto } from '../../api/types';
import { getRandomPhoto } from '../../api/unsplash';
import {
  ASYNC_CREATE_BOARD,
  ASYNC_FETCH_ALL_BOARDS,
  ASYNC_FETCH_BOARD_BG_IMAGES,
  ASYNC_FETCH_CURRENT_BOARD,
  IAsyncCreateBoardAction,
  IAsyncFetchCurrentBoardAction,
  insertBoard,
  setAllBoardList,
  setCurrentBoard,
  setFragmentColumns,
  setStandbyBoardBgImages,
  updateBoard,
} from '../actions';
import { getAllBoards } from './selectors';

import { makeSagaWorkerDispatcher } from './helpers';

function* fetchBoardBgImagesSaga() {
  const images: IUnsplashPhoto[] = yield call(getRandomPhoto, 4);
  yield put(setStandbyBoardBgImages(images));
}

function* fetchAllBoards() {
  const boards: IBoard[] = yield call(asyncSelectAllBoards);
  yield put(setAllBoardList(boards));
  return boards;
}

function* createBoardSaga(action: IAsyncCreateBoardAction) {
  const { board } = action.payload;
  const newBoard = yield call(asyncInsertBoard, board);
  const allBoards: Immutable.List<IBoard> = yield select(getAllBoards);
  const index = allBoards.findIndex((oldBoard) => newBoard.id === oldBoard.id);
  // NOTE: save in json db
  asyncSetBoardLocally(newBoard);

  if (index > -1) {
    yield put(updateBoard(index, newBoard));
  } else {
    yield put(insertBoard(0, newBoard));
  }
  return newBoard;
}

function* fetchCurrentBoardSaga(action: IAsyncFetchCurrentBoardAction) {
  const { boardID } = action.payload;
  const board: IBoard | undefined = yield call(asyncFetchBoard, boardID);
  if (board && board.id) {
    const now = Date.now();
    board.checked_at = now;
    const columns: IFragmentColumn[] = yield call(
      asyncGetFragmentColumnsLocally,
      board
    );
    yield put(setCurrentBoard(board));
    yield put(setFragmentColumns(columns));
    yield call(asyncUpdateBoard, board.id, { checked_at: now });
  }
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_BOARD]: createBoardSaga,
  [ASYNC_FETCH_ALL_BOARDS]: fetchAllBoards,
  [ASYNC_FETCH_BOARD_BG_IMAGES]: fetchBoardBgImagesSaga,
  [ASYNC_FETCH_CURRENT_BOARD]: fetchCurrentBoardSaga,
});

export function* watchBoardSagas() {
  yield takeEvery(
    [
      ASYNC_CREATE_BOARD,
      ASYNC_FETCH_ALL_BOARDS,
      ASYNC_FETCH_BOARD_BG_IMAGES,
      ASYNC_FETCH_CURRENT_BOARD,
    ],
    dispatcher
  );
}
