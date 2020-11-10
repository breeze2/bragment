import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  asyncAdjustTwoBoardColumnOrders,
  asyncCheckBoard,
  asyncCreateBoard,
  asyncFetchAllBoards,
  asyncFetchBoard,
  boardComparatorByCheckedAt,
} from '../api/board';
import { EBoardPolicy, EBoardType, IBoard } from '../api/types';
import { getRandomPhoto } from '../api/unsplash';
import { preloadImages } from '../utils';
import { fragmentColumnThunks } from './fragmentColumnSlice';
import { IBoardsExtraState, IReduxState } from './types';

const adapter = createEntityAdapter<IBoard>({
  sortComparer: boardComparatorByCheckedAt,
});

const thunks = {
  create: createAsyncThunk(
    'board/create',
    async (
      options: {
        title: string;
        type: EBoardType;
        policy: EBoardPolicy;
      } & Partial<IBoard>
    ) => {
      const board = await asyncCreateBoard({
        ...options,
      });
      return board;
    }
  ),
  fetchAll: createAsyncThunk('board/fetchAll', async () => {
    const boards = await asyncFetchAllBoards();
    return boards;
  }),
  fetch: createAsyncThunk('board/fetch', async (boardId: string) => {
    const board = await asyncFetchBoard(boardId);
    if (board.id) {
      asyncCheckBoard(board.id);
    }
    return board;
  }),
  moveColumn: createAsyncThunk(
    'board/moveColumn',
    async (
      arg: {
        fromBoardId: string;
        fromId: string;
        toBoardId: string;
        toId?: string;
      },
      thunkAPI
    ) => {
      const { fromBoardId, toBoardId } = arg;
      const rootState = thunkAPI.getState() as IReduxState;
      const { selectById } = adapter.getSelectors();
      const fromBoard = selectById(rootState.board, fromBoardId);
      const toBoard = selectById(rootState.board, toBoardId);
      if (fromBoard && toBoard) {
        await asyncAdjustTwoBoardColumnOrders(
          fromBoard.id,
          fromBoard.columnOrder,
          toBoard.id,
          toBoard.columnOrder
        );
      }
    }
  ),
  fetchBgImages: createAsyncThunk('board/fetchBgImages', async () => {
    const count = 4;
    const images = await getRandomPhoto(count);
    return images;
  }),
};

const slice = createSlice({
  name: 'board',
  initialState: adapter.getInitialState<IBoardsExtraState>({
    createDialogVisible: false,
    currentId: undefined,
    loading: false,
    standbyBgColors: [
      'var(--blue)',
      'var(--cyan)',
      'var(--green)',
      'var(--orange)',
      'var(--purple)',
      'var(--red)',
      'var(--yellow)',
      'var(--grey)',
    ],
    standbyBgImages: [],
  }),
  reducers: {
    setCurrentId(state, action: PayloadAction<string | undefined>) {
      state.currentId = action.payload;
    },
    setCreateDialogVisible(state, action: PayloadAction<boolean>) {
      state.createDialogVisible = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunks.create.fulfilled, (state, action) => {
      adapter.addOne(state, action.payload);
    });
    builder.addCase(thunks.fetch.fulfilled, (state, action) => {
      const board = action.payload;
      adapter.upsertOne(state, board);
    });
    builder.addCase(thunks.fetchAll.fulfilled, (state, action) => {
      const boards = action.payload;
      adapter.setAll(state, boards);
    });
    builder.addCase(thunks.moveColumn.pending, (state, action) => {
      const { fromBoardId, fromId, toBoardId, toId } = action.meta.arg;
      const { selectById } = adapter.getSelectors();
      const fromBoard = selectById(state, fromBoardId);
      const toBoard = selectById(state, toBoardId);
      if (fromBoard && toBoard) {
        const fromColumnOrder = [...fromBoard.columnOrder];
        const toColumnOrder =
          fromBoard === toBoard ? fromColumnOrder : [...toBoard.columnOrder];
        const fromIndex = fromColumnOrder.findIndex((id) => id === fromId);
        const toIndex = toColumnOrder.findIndex((id) => id === toId);
        if (fromIndex > -1) {
          fromColumnOrder.splice(fromIndex, 1);
          toColumnOrder.splice(toIndex > 0 ? toIndex : 0, 0, fromId);
          adapter.updateMany(state, [
            { id: fromBoardId, changes: { columnOrder: fromColumnOrder } },
            { id: toBoardId, changes: { columnOrder: toColumnOrder } },
          ]);
        }
      }
    });
    builder.addCase(thunks.moveColumn.fulfilled, (state, action) => {
      // NOTE: do nothing
    });
    builder.addCase(thunks.moveColumn.rejected, (state, action) => {
      // TODO: alert error and refresh board data
    });
    builder.addCase(thunks.fetchBgImages.fulfilled, (state, action) => {
      const images = action.payload;
      state.standbyBgImages = action.payload;
      preloadImages(images.map((el) => el.urls.thumb));
    });
    builder.addCase(fragmentColumnThunks.create.fulfilled, (state, action) => {
      const column = action.payload;
      const board = adapter.getSelectors().selectById(state, column.boardId);
      if (board) {
        adapter.updateOne(state, {
          id: column.boardId,
          changes: { columnOrder: board.columnOrder.concat([column.id]) },
        });
      }
    });
  },
});

export const boardActions = slice.actions;
export const boardReducer = slice.reducer;
export const boardSelectors = adapter.getSelectors();
export const boardThunks = thunks;
