import { call, put, takeEvery } from 'redux-saga/effects';
import {
  asyncFetchBoard,
  asyncInsertNewBoard,
  asyncSelectAllBoards,
  asyncUpdateBoard,
} from '../../api/board';
import { IBoard } from '../../api/types';
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
  setStandbyBoardBgImages,
} from '../actions';

import { makeSagaWorkerDispatcher } from './helpers';

function* fetchBoardBgImagesSaga() {
  const images = yield call(getRandomPhoto, 4);
  yield put(setStandbyBoardBgImages(images));
}

function* fetchAllBoards() {
  const boards: IBoard[] = yield call(asyncSelectAllBoards);
  yield put(setAllBoardList(boards));
  return boards;
}

function* createBoardSaga(action: IAsyncCreateBoardAction) {
  const { board } = action.payload;
  const result = yield call(asyncInsertNewBoard, board);
  yield put(insertBoard(0, board));
  return result;
}

function* fetchCurrentBoardSaga(action: IAsyncFetchCurrentBoardAction) {
  const { boardID } = action.payload;
  const board: IBoard | undefined = yield call(asyncFetchBoard, boardID);
  if (board && board.id) {
    const now = Date.now();
    board.checked_at = now;
    yield put(setCurrentBoard(board));
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
