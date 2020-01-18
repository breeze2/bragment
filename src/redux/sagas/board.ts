import { call, put, takeEvery } from 'redux-saga/effects';
import { asyncInsertNewBoard, asyncSelectAllBoards } from '../../api/board';
import { IBoard } from '../../api/types';
import { getRandomPhoto } from '../../api/unsplash';
import {
  ASYNC_CREATE_BOARD,
  ASYNC_FETCH_ALL_BOARDS,
  ASYNC_FETCH_BOARD_BG_IMAGES,
  IAsyncCreateBoardAction,
  setPersonalBoardList,
  setStandbyBoardBgImages,
} from '../actions';

import { makeSagaWorkerDispatcher } from './helpers';

function* fetchBoardBgImagesSaga() {
  const images = yield call(getRandomPhoto, 4);
  yield put(setStandbyBoardBgImages(images));
}

function* fetchAllBoards() {
  const result: IBoard[] = yield call(asyncSelectAllBoards);
  yield put(setPersonalBoardList(result));
  return result;
}

function* createBoardSaga(action: IAsyncCreateBoardAction) {
  const { board } = action.payload;
  const result = yield call(asyncInsertNewBoard, board);
  return result;
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_BOARD]: createBoardSaga,
  [ASYNC_FETCH_ALL_BOARDS]: fetchAllBoards,
  [ASYNC_FETCH_BOARD_BG_IMAGES]: fetchBoardBgImagesSaga,
});

export function* watchBoardSagas() {
  yield takeEvery(
    [ASYNC_CREATE_BOARD, ASYNC_FETCH_ALL_BOARDS, ASYNC_FETCH_BOARD_BG_IMAGES],
    dispatcher
  );
}
