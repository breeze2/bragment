import Immutable from 'immutable';
import { IFragmentColumn } from '../../api/types';
import { deleteArrayItem, insertArrayItem } from '../../utils';
import {
  IFragmentAction,
  IMoveFragmentAction,
  IMoveFragmentColumnAction,
  IPushFragmentAction,
  IPushFragmentColumnAction,
  IRenameFragmentColumnAction,
  MOVE_FRAGMENT,
  MOVE_FRAGMENT_COLUMN,
  PUSH_FRAGMENT,
  PUSH_FRAGMENT_COLUMN,
  RENAME_FRAGMENT_COLUMN,
  SET_FRAGMENT_COLUMNS,
} from '../actions';
import { IFragmentState, IIFragmentState } from '../types';

const initialFragmentState = Immutable.Record<IFragmentState>({
  columns: Immutable.List<IFragmentColumn>([]),
})();

function handleMoveFragment(
  state: IIFragmentState,
  action: IMoveFragmentAction
) {
  const {
    fromColumnID,
    fromIndex,
    toColumnID,
    toIndex,
    newID,
  } = action.payload;
  const columns = state.get('columns');
  const fromColumnIndex = columns.findIndex(
    (column) => column.id === fromColumnID
  );
  const toColumnIndex = columns.findIndex((column) => column.id === toColumnID);
  const fromColumn = columns.get(fromColumnIndex);
  const toColumn = columns.get(toColumnIndex);
  if (fromColumnIndex > -1 && toColumnIndex > -1 && fromColumn && toColumn) {
    const fromFragment = fromColumn.fragments[fromIndex];
    if (fromFragment) {
      if (newID) {
        fromFragment.id = newID;
      }
      return state.update('columns', (list) =>
        list
          .update(fromColumnIndex, (column) => ({
            ...column,
            fragments: deleteArrayItem(column.fragments, fromIndex),
          }))
          .update(toColumnIndex, (column) => ({
            ...column,
            fragments: insertArrayItem(column.fragments, fromFragment, toIndex),
          }))
      );
    }
  }
  return state;
}

function handlePushFragment(
  state: IIFragmentState,
  action: IPushFragmentAction
) {
  const { columnID, fragment } = action.payload;
  const columns = state.get('columns');
  const index = columns.findIndex((el) => el.id === columnID);
  if (index !== -1) {
    return state.update('columns', (list) =>
      list.update(index, (column) => ({
        ...column,
        fragments: [...column.fragments, fragment],
      }))
    );
  }
  return state;
}

function handlePushFragmentColumn(
  state: IIFragmentState,
  action: IPushFragmentColumnAction
) {
  const { column } = action.payload;
  const columns = state.get('columns');
  if (columns.findIndex((el) => el.title === column.title) === -1) {
    return state.update('columns', (list) => list.push(column));
  }
  return state;
}

function handleMoveFragmentColumn(
  state: IIFragmentState,
  action: IMoveFragmentColumnAction
) {
  const { from, to } = action.payload;
  const column = state.columns.get(from);
  if (from !== to && column) {
    return state.update('columns', (columns) =>
      columns.splice(from, 1).splice(to, 0, column)
    );
  }
  return state;
}

function handleRenameFragmentColumn(
  state: IIFragmentState,
  action: IRenameFragmentColumnAction
) {
  const { id, title } = action.payload;
  const index = state.columns.findIndex((column) => column.id === id);
  if (index > -1) {
    return state.update('columns', (columns) =>
      columns.update(index, (column) => ({
        ...column,
        // TODO: generate id
        id: title,
        title,
      }))
    );
  }
  return state;
}

const fragmentReducer = (
  state = initialFragmentState,
  action: IFragmentAction
) => {
  switch (action.type) {
    case SET_FRAGMENT_COLUMNS:
      return state.set(
        'columns',
        Immutable.List<IFragmentColumn>(action.payload.columns)
      );
    case MOVE_FRAGMENT:
      return handleMoveFragment(state, action);
    case PUSH_FRAGMENT:
      return handlePushFragment(state, action);
    case PUSH_FRAGMENT_COLUMN:
      return handlePushFragmentColumn(state, action);
    case MOVE_FRAGMENT_COLUMN:
      return handleMoveFragmentColumn(state, action);
    case RENAME_FRAGMENT_COLUMN:
      return handleRenameFragmentColumn(state, action);
    default:
      return state;
  }
};

export default fragmentReducer;
