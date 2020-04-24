import Immutable from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { asyncPushBoardColumnOrder, asyncUpdateBoard } from '../../api/board';
import {
  asyncBatchUpdateFragmentColumns,
  asyncInsertFragmentCard,
  asyncInsertFragmentColumn,
  asyncPushFragmentColumnCardOrder,
  asyncUpdateFragmentColumn,
} from '../../api/fragment';
import { IBoard, IFragmentColumn, IUpdateDataGroup } from '../../api/types';
import {
  ASYNC_CREATE_FRAGMENT_CARD,
  ASYNC_CREATE_FRAGMENT_COLUMN,
  ASYNC_MOVE_FRAGMENT_CARD,
  ASYNC_MOVE_FRAGMENT_COLUMN,
  ASYNC_RENAME_FRAGMENT_COLUMN,
  IAsyncCreateFragmentCardAction,
  IAsyncCreateFragmentColumnAction,
  IAsyncMoveFragmentCardAction,
  IAsyncMoveFragmentColumnAction,
  IAsyncRenameFragmentColumnAction,
  moveFragmentCard,
  pushFragmentCard,
  pushFragmentColumn,
  renameFragmentColumn,
  setCurrentBoard,
} from '../actions';
import { makeSagaWorkerDispatcher } from './helpers';
import { getCurrentBoard, getFragmentColumnMap } from './selectors';

function* createFragmentCardSaga(action: IAsyncCreateFragmentCardAction) {
  const { boardId, columnId, title, others } = action.payload;
  const card = yield call(
    asyncInsertFragmentCard,
    boardId,
    columnId,
    title,
    others
  );
  const currentBoard: IBoard | null = yield select(getCurrentBoard);
  if (card && card.id && currentBoard && currentBoard.id === boardId) {
    yield put(pushFragmentCard(columnId, card));
    // yield call(asyncPushBoardColumnOrder, boardId, column.id);
    // NOTE: not wait
    asyncPushFragmentColumnCardOrder(columnId, card.id);
  } else {
    // TODO: update fragment columns data locally
  }
  return card;
}

function* createFragmentColumnSaga(action: IAsyncCreateFragmentColumnAction) {
  const { boardId, title } = action.payload;
  const column: IFragmentColumn | undefined = yield call(
    asyncInsertFragmentColumn,
    boardId,
    title
  );
  const currentBoard: IBoard | null = yield select(getCurrentBoard);
  if (column && column.id && currentBoard && currentBoard.id === boardId) {
    yield put(pushFragmentColumn(column));
    // yield call(asyncPushBoardColumnOrder, boardId, column.id);
    // NOTE: not wait
    asyncPushBoardColumnOrder(boardId, column.id);
  }
  return column;
}

function* moveFragmentCardSaga(action: IAsyncMoveFragmentCardAction) {
  // const board: IBoard | null = yield select(getCurrentBoard);
  // const fragmentColumns: Immutable.List<IFragmentColumn> = yield select(
  //   getFragmentColumns
  // );
  const { fromColumnId, fromId, toColumnId, toId } = action.payload;
  yield put(moveFragmentCard(fromColumnId, fromId, toColumnId, toId));
  const columnMap:
    | Immutable.Map<string, IFragmentColumn>
    | undefined = yield select(getFragmentColumnMap);
  const fromColumn = columnMap?.get(fromColumnId);
  const toColumn = columnMap?.get(toColumnId);
  const group: IUpdateDataGroup<IFragmentColumn> = [];
  if (fromColumn) {
    group.push({
      id: fromColumn.id,
      data: { cardOrder: fromColumn.cardOrder },
    });
  }
  if (toColumn) {
    group.push({
      id: toColumn.id,
      data: { cardOrder: toColumn.cardOrder },
    });
  }
  if (group.length > 0) {
    // yield call(asyncBatchUpdateFragmentColumns, group);
    // NOTE: not wait
    asyncBatchUpdateFragmentColumns(group);
  }
}

function* renameFragmentColumnSaga(action: IAsyncRenameFragmentColumnAction) {
  const { id, title } = action.payload;
  yield put(renameFragmentColumn(id, title));
  // yield call(asyncUpdateFragmentColumn, id, {title});
  // NOTE: not wait
  asyncUpdateFragmentColumn(id, { title });
}

function* moveFragmentColumnSaga(action: IAsyncMoveFragmentColumnAction) {
  const { fromId, toId } = action.payload;
  const currentBoard: IBoard | null = yield select(getCurrentBoard);
  const columnOrder = currentBoard?.columnOrder;
  if (currentBoard && columnOrder) {
    const fromIndex = columnOrder.findIndex((id) => fromId === id);
    const toIndex = columnOrder.findIndex((id) => toId === id);
    if (fromIndex > -1 && toIndex > -1 && fromIndex !== toIndex) {
      columnOrder.splice(fromIndex, 1);
      columnOrder.splice(toIndex, 0, fromId);
      yield put(setCurrentBoard({ ...currentBoard, columnOrder }));
      yield call(asyncUpdateBoard, currentBoard.id, { columnOrder });
    }
  }
}

const dispatcher = makeSagaWorkerDispatcher({
  [ASYNC_CREATE_FRAGMENT_CARD]: createFragmentCardSaga,
  [ASYNC_CREATE_FRAGMENT_COLUMN]: createFragmentColumnSaga,
  [ASYNC_MOVE_FRAGMENT_CARD]: moveFragmentCardSaga,
  [ASYNC_MOVE_FRAGMENT_COLUMN]: moveFragmentColumnSaga,
  [ASYNC_RENAME_FRAGMENT_COLUMN]: renameFragmentColumnSaga,
});

export function* watchFragmentSagas() {
  yield takeEvery(
    [
      ASYNC_CREATE_FRAGMENT_CARD,
      ASYNC_CREATE_FRAGMENT_COLUMN,
      ASYNC_MOVE_FRAGMENT_CARD,
      ASYNC_MOVE_FRAGMENT_COLUMN,
      ASYNC_RENAME_FRAGMENT_COLUMN,
    ],
    dispatcher
  );
}
