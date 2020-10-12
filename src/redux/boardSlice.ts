import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  asyncAdjustBoardColumnOrder,
  asyncCheckBoard,
  asyncFetchAllBoards,
  asyncFetchBoard,
  asyncInsertBoard,
  boardComparatorByCheckedAt,
} from '../api/board';
import { EBoardPolicy, EBoardType, IBoard } from '../api/types';
import { getRandomPhoto } from '../api/unsplash';
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
      // TODO: get user id
      const userId = '1';
      const board = await asyncInsertBoard({
        userId,
        ...options,
      });
      return board;
    }
  ),
  fetchAll: createAsyncThunk('board/fetchAll', async () => {
    // TODO: get user id
    const userId = '1';
    const boards = await asyncFetchAllBoards(userId);
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
        fromId: string;
        toId: string;
      },
      thunkAPI
    ) => {
      const rootState = thunkAPI.getState() as IReduxState;
      const id = rootState.board.currentId;
      const currentBoard = id
        ? boardSelectors.selectById(rootState.board, id)
        : undefined;
      if (id && currentBoard) {
        await asyncAdjustBoardColumnOrder(id, currentBoard.columnOrder);
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
      state.currentId = board.id;
    });
    builder.addCase(thunks.fetchAll.fulfilled, (state, action) => {
      const boards = action.payload;
      adapter.setAll(state, boards);
    });
    builder.addCase(thunks.moveColumn.pending, (state, action) => {
      const { fromId, toId } = action.meta.arg;
      const { currentId } = state;
      const currentBoard = currentId
        ? boardSelectors.selectById(state, currentId)
        : undefined;
      if (currentId && currentBoard) {
        const columnOrder = [...currentBoard.columnOrder];
        const fromIndex = columnOrder.findIndex((el) => fromId === el);
        const toIndex = columnOrder.findIndex((el) => toId === el);
        if (fromIndex > -1 && toIndex > -1 && fromIndex !== toIndex) {
          columnOrder.splice(fromIndex, 1);
          columnOrder.splice(toIndex, 0, fromId);
          adapter.updateOne(state, { id: currentId, changes: { columnOrder } });
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
      state.standbyBgImages = action.payload;
    });
  },
});

export const boardActions = slice.actions;
export const boardReducer = slice.reducer;
export const boardSelectors = adapter.getSelectors();
export const boardThunks = thunks;
