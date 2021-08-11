import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  asyncAdjustTowColumnCardOrders,
  asyncCreateColumn,
  asyncFetchColumns,
  asyncUpdateColumn,
} from '../api/database/column';
import { IColumn } from '../api/database/types';
import { cardThunks } from './cardSlice';
import {
  EReduxThunkErrorMessage,
  IColumnExtraState,
  IReduxState,
} from './types';

const adapter = createEntityAdapter<IColumn>();

const thunks = {
  create: createAsyncThunk(
    'column/create',
    async (
      options: { boardId: string; title: string } & Partial<IColumn>,
      thunkAPI
    ) => {
      const column = await asyncCreateColumn({
        ...options,
      });
      return column;
    }
  ),
  rename: createAsyncThunk(
    'column/rename',
    async (
      arg: {
        id: string;
        title: string;
      },
      thunkAPI
    ) => {
      const { id, title } = arg;
      await asyncUpdateColumn(id, { title });
    }
  ),
  moveCard: createAsyncThunk(
    'column/moveCard',
    async (
      arg: {
        fromColumnId: string;
        fromId: string;
        toColumnId: string;
        toId?: string;
      },
      thunkAPI
    ) => {
      const { fromColumnId, toColumnId } = arg;
      const rootState = thunkAPI.getState() as IReduxState;
      const { selectById } = adapter.getSelectors();
      const fromColumn = selectById(rootState.column, fromColumnId);
      const toColumn = selectById(rootState.column, toColumnId);

      if (fromColumn && toColumn) {
        await asyncAdjustTowColumnCardOrders(
          fromColumn.id,
          fromColumn.cardOrder,
          toColumn.id,
          toColumn.cardOrder
        );
      }
    }
  ),
  fetchByBoard: createAsyncThunk(
    'column/fetchByBoard',
    async (boardId: string) => {
      const columns = await asyncFetchColumns(boardId);
      return columns;
    }
  ),
};

const slice = createSlice({
  name: 'column',
  initialState: adapter.getInitialState<IColumnExtraState>({
    currentId: undefined,
    loading: false,
  }),
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunks.create.fulfilled, (state, action) => {
      const column = action.payload;
      adapter.addOne(state, column);
    });
    builder.addCase(thunks.fetchByBoard.fulfilled, (state, action) => {
      const columns = action.payload;
      adapter.upsertMany(state, columns);
      state.currentId = undefined;
    });
    builder.addCase(thunks.rename.pending, (state, action) => {
      const { id, title } = action.meta.arg;
      const columns = adapter.getSelectors().selectAll(state);
      if (columns.some((el) => el.id !== id && el.title === title)) {
        throw new Error(EReduxThunkErrorMessage.EXISTED_COLUMN);
      }
      adapter.updateOne(state, { id, changes: { title } });
    });
    builder.addCase(thunks.rename.fulfilled, (state, action) => {
      // NOTE: do nothing
    });
    builder.addCase(thunks.rename.rejected, (state, action) => {
      // TODO: alert error and refresh column data
    });
    builder.addCase(thunks.moveCard.pending, (state, action) => {
      const { fromColumnId, fromId, toColumnId, toId } = action.meta.arg;
      const { selectById } = adapter.getSelectors();
      const fromColumn = selectById(state, fromColumnId);
      const toColumn = selectById(state, toColumnId);
      if (fromColumn && toColumn) {
        const fromCardOrder = [...fromColumn.cardOrder];
        const toCardOrder =
          fromColumn === toColumn ? fromCardOrder : [...toColumn.cardOrder];
        const fromIndex = fromCardOrder.findIndex((id) => id === fromId);
        const toIndex = toCardOrder.findIndex((id) => id === toId);
        if (fromIndex > -1) {
          fromCardOrder.splice(fromIndex, 1);
          toCardOrder.splice(toIndex > 0 ? toIndex : 0, 0, fromId);
          adapter.updateMany(state, [
            { id: fromColumnId, changes: { cardOrder: fromCardOrder } },
            { id: toColumnId, changes: { cardOrder: toCardOrder } },
          ]);
        }
      }
    });
    builder.addCase(thunks.moveCard.fulfilled, (state, action) => {
      // NOTE: do nothing
    });
    builder.addCase(thunks.moveCard.rejected, (state, action) => {
      // TODO: alert error and refresh column data
    });
    builder.addCase(cardThunks.create.fulfilled, (state, action) => {
      const card = action.payload;
      const column = adapter.getSelectors().selectById(state, card.columnId);
      if (column) {
        adapter.updateOne(state, {
          id: card.columnId,
          changes: { cardOrder: column.cardOrder.concat([card.id]) },
        });
      }
    });
  },
});

export const columnActions = slice.actions;
export const columnReducer = slice.reducer;
export const columnSelectors = adapter.getSelectors();
export const columnThunks = thunks;
