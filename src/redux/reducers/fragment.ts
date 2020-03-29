import Immutable from 'immutable';
import { IFragmentColumn } from '../../api/types';
import {
  IFragmentAction,
  IMoveFragmentColumnAction,
  IPushFragmentColumnAction,
  IRenameFragmentColumnAction,
  MOVE_FRAGMENT_COLUMN,
  PUSH_FRAGMENT_COLUMN,
  RENAME_FRAGMENT_COLUMN,
  SET_FRAGMENT_COLUMNS,
} from '../actions';
import { IFragmentState, IIFragmentState } from '../types';

const initialFragmentState = Immutable.Record<IFragmentState>({
  columns: Immutable.List<IFragmentColumn>([]),
})();

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
  if (column) {
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
  const { from, to } = action.payload;
  const index = state.columns.findIndex((column) => column.title === from);
  if (index > -1) {
    return state.update('columns', (columns) =>
      columns.update(index, (column) => ({
        ...column,
        title: to,
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
