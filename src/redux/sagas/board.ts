import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  asyncCheckBoard,
  asyncFetchBoard,
  asyncInsertBoard,
  asyncSelectPersonalBoards,
} from '../../api/board';
import {
  asyncFetchFragmentCardMap,
  asyncFetchFragmentColumnMap,
} from '../../api/fragment';
import {
  IBoard,
  IFragmentCard,
  IFragmentColumn,
  IUnsplashPhoto,
} from '../../api/types';
import { getRandomPhoto } from '../../api/unsplash';
import {
  ASYNC_CREATE_BOARD,
  ASYNC_FETCH_BOARD_BG_IMAGES,
  ASYNC_FETCH_CURRENT_BOARD,
  ASYNC_FETCH_PERSONAL_BOARDS,
  IAsyncCreateBoardAction,
  IAsyncFetchCurrentBoardAction,
  insertBoard,
  setCurrentBoard,
  setFragmentCardMap,
  setFragmentColumnMap,
  setPersonalBoardList,
  setStandbyBoardBgImages,
} from '../actions';

import { makeSagaWorkerDispatcher } from './helpers';

function* fetchBoardBgImagesSaga() {
  const images: IUnsplashPhoto[] = yield call(getRandomPhoto, 4);
  yield put(setStandbyBoardBgImages(images));
}

function* fetchPersonalBoards() {
  // TODO: get user id
  const userId = '1';
  const boards: IBoard[] = yield call(asyncSelectPersonalBoards, userId);
  yield put(setPersonalBoardList(boards));
  return boards;
}

function* createBoardSaga(action: IAsyncCreateBoardAction) {
  const { board: options } = action.payload;
  // TODO: get user id
  options.userId = '1';
  const board: IBoard | undefined = yield call(asyncInsertBoard, options);
  if (board) {
    yield put(insertBoard(0, board));
  }
}

function* fetchBoardSaga(boardId: string) {
  const board = yield call(asyncFetchBoard, boardId);
  yield put(setCurrentBoard(board));
  return board;
}

function* fetchBoardCardMapSaga(boardId: string) {
  const cardMap = yield call(asyncFetchFragmentCardMap, boardId);
  yield put(setFragmentCardMap(cardMap));
  return cardMap;
}

function* fetchBoardColumnMapSaga(boardId: string) {
  const columnMap = yield call(asyncFetchFragmentColumnMap, boardId);
  yield put(setFragmentColumnMap(columnMap));
  return columnMap;
}

function* fetchCurrentBoardSaga(action: IAsyncFetchCurrentBoardAction) {
  const { id } = action.payload;
  const {
    board,
    cardMap,
    columnMap,
  }: {
    board: IBoard;
    cardMap: Map<string, IFragmentCard>;
    columnMap: Map<string, IFragmentColumn>;
  } = yield all({
    board: call(fetchBoardSaga, id),
    cardMap: call(fetchBoardCardMapSaga, id),
    columnMap: call(fetchBoardColumnMapSaga, id),
  });
  if (board.id) {
    asyncCheckBoard(board.id);
  }
  if (board.columnOrder.length < columnMap.size) {
    // TODO: do something
  }
  if (
    Array.from(columnMap.keys()).reduce((prev, key) => {
      const column = columnMap.get(key);
      return prev + (column ? column.cardOrder.length : 0);
    }, 0) < cardMap.size
  ) {
    // TODO: do something
  }
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_BOARD]: createBoardSaga,
  [ASYNC_FETCH_PERSONAL_BOARDS]: fetchPersonalBoards,
  [ASYNC_FETCH_BOARD_BG_IMAGES]: fetchBoardBgImagesSaga,
  [ASYNC_FETCH_CURRENT_BOARD]: fetchCurrentBoardSaga,
});

export function* watchBoardSagas() {
  yield takeEvery(
    [
      ASYNC_CREATE_BOARD,
      ASYNC_FETCH_PERSONAL_BOARDS,
      ASYNC_FETCH_BOARD_BG_IMAGES,
      ASYNC_FETCH_CURRENT_BOARD,
    ],
    dispatcher
  );
}
