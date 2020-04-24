import Immutable from 'immutable';
import { IFragmentCard, IFragmentColumn } from '../../api/types';
import {
  IFragmentAction,
  IMoveFragmentCardAction,
  IPushFragmentCardAction,
  IPushFragmentColumnAction,
  IRenameFragmentColumnAction,
  ISetFragmentCardMapAction,
  ISetFragmentColumnMapAction,
  MOVE_FRAGMENT_CARD,
  PUSH_FRAGMENT_CARD,
  PUSH_FRAGMENT_COLUMN,
  RENAME_FRAGMENT_COLUMN,
  SET_CURRENT_FRAGMENT,
  SET_FRAGMENT_CARD_MAP,
  SET_FRAGMENT_COLUMN_MAP,
} from '../actions';
import { IFragmentState, IIFragmentState } from '../types';

const initialFragmentState = Immutable.Record<IFragmentState>({
  cardMap: Immutable.Map<IFragmentCard>({}),
  columnMap: Immutable.Map<IFragmentColumn>({}),
  current: null,
})();

function handleMoveFragmentCard(
  state: IIFragmentState,
  action: IMoveFragmentCardAction
) {
  const { fromColumnId, fromId, toColumnId, toId } = action.payload;
  const columnMap = state.get('columnMap');
  const fromColumn = columnMap.get(fromColumnId);
  const toColumn = columnMap.get(toColumnId);
  const fromCardOrder = fromColumn?.cardOrder;
  const toCardOrder = toColumn?.cardOrder;
  if (fromCardOrder && toCardOrder) {
    const fromIndex = fromCardOrder.findIndex((id) => id === fromId);
    const toIndex = toCardOrder.findIndex((id) => id === toId);
    if (fromIndex > -1) {
      fromCardOrder.splice(fromIndex, 1);
      toCardOrder.splice(toIndex > 0 ? toIndex : 0, 0, fromId);
      return state.update('columnMap', (map) =>
        map
          .update(fromColumnId, (column) => ({ ...column, fromCardOrder }))
          .update(toColumnId, (column) => ({ ...column, toCardOrder }))
      );
    }
  }
  return state;
}

function handlePushFragmentCard(
  state: IIFragmentState,
  action: IPushFragmentCardAction
) {
  const { card } = action.payload;
  return state.update('cardMap', (cardMap) => cardMap.set(card.id, card));
}

function handlePushFragmentColumn(
  state: IIFragmentState,
  action: IPushFragmentColumnAction
) {
  const { column } = action.payload;
  return state.update('columnMap', (columnMap) =>
    columnMap.set(column.id, column)
  );
}

function handleRenameFragmentColumn(
  state: IIFragmentState,
  action: IRenameFragmentColumnAction
) {
  const { id, title } = action.payload;
  if (state.columnMap.has(id)) {
    return state.update('columnMap', (columnMap) =>
      columnMap.update(id, (column) => ({
        ...column,
        title,
      }))
    );
  }
  return state;
}

function handleSetFragmentCardMap(
  state: IIFragmentState,
  action: ISetFragmentCardMapAction
) {
  const { cardMap } = action.payload;
  return state.set('cardMap', Immutable.Map(cardMap));
}

function handleSetFragmentColumnMap(
  state: IIFragmentState,
  action: ISetFragmentColumnMapAction
) {
  const { columnMap } = action.payload;
  return state.set('columnMap', Immutable.Map(columnMap));
}

const fragmentReducer = (
  state = initialFragmentState,
  action: IFragmentAction
) => {
  switch (action.type) {
    case SET_FRAGMENT_CARD_MAP:
      return handleSetFragmentCardMap(state, action);
    case SET_FRAGMENT_COLUMN_MAP:
      return handleSetFragmentColumnMap(state, action);
    case SET_CURRENT_FRAGMENT:
      return state.set('current', action.payload.current);
    case MOVE_FRAGMENT_CARD:
      return handleMoveFragmentCard(state, action);
    case PUSH_FRAGMENT_CARD:
      return handlePushFragmentCard(state, action);
    case PUSH_FRAGMENT_COLUMN:
      return handlePushFragmentColumn(state, action);
    case RENAME_FRAGMENT_COLUMN:
      return handleRenameFragmentColumn(state, action);
    default:
      return state;
  }
};

export default fragmentReducer;
