import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  asyncAdjustTowFragmentColumnCardOrders,
  asyncCreateFragmentColumn,
  asyncFetchFragmentColumns,
  asyncUpdateFragmentColumn,
} from '../api/fragment';
import { IFragmentColumn } from '../api/types';
import { fragmentCardThunks } from './fragmentCardSlice';
import {
  EFragmentThunkErrorMessage,
  IFragmentColumnExtraState,
  IReduxState,
} from './types';

const adapter = createEntityAdapter<IFragmentColumn>();

const thunks = {
  create: createAsyncThunk(
    'fragmentColumn/create',
    async (
      options: { boardId: string; title: string } & Partial<IFragmentColumn>,
      thunkAPI
    ) => {
      const userId = '1';
      const column = await asyncCreateFragmentColumn({
        userId,
        ...options,
      });
      return column;
    }
  ),
  rename: createAsyncThunk(
    'fragmentColumn/rename',
    async (
      arg: {
        id: string;
        title: string;
      },
      thunkAPI
    ) => {
      const { id, title } = arg;
      await asyncUpdateFragmentColumn(id, { title });
    }
  ),
  moveCard: createAsyncThunk(
    'fragmentColumn/moveCard',
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
      const fromColumn = selectById(rootState.fragmentColumn, fromColumnId);
      const toColumn = selectById(rootState.fragmentColumn, toColumnId);

      if (fromColumn && toColumn) {
        await asyncAdjustTowFragmentColumnCardOrders(
          fromColumn.id,
          fromColumn.cardOrder,
          toColumn.id,
          toColumn.cardOrder
        );
      }
    }
  ),
  fetchByBoard: createAsyncThunk(
    'fragmentColumn/fetchByBoard',
    async (boardId: string) => {
      const columns = await asyncFetchFragmentColumns(boardId);
      return columns;
    }
  ),
};

const slice = createSlice({
  name: 'fragmentColumn',
  initialState: adapter.getInitialState<IFragmentColumnExtraState>({
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
        throw new Error(EFragmentThunkErrorMessage.EXISTED_COLUMN);
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
    builder.addCase(fragmentCardThunks.create.fulfilled, (state, action) => {
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

export const fragmentColumnActions = slice.actions;
export const fragmentColumnReducer = slice.reducer;
export const fragmentColumnSelectors = adapter.getSelectors();
export const fragmentColumnThunks = thunks;
