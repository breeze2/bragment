import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  asyncCreateFragmentCard,
  asyncFetchFragmentCards,
} from '../api/fragment';
import { EFragmentType, IFragmentCard } from '../api/types';
import { IFragmentCardExtraState } from './types';

const adapter = createEntityAdapter<IFragmentCard>();

const thunks = {
  create: createAsyncThunk(
    'fragmentCard/create',
    async (
      options: {
        boardId: string;
        columnId: string;
        title: string;
      } & Partial<IFragmentCard>,
      thunkAPI
    ) => {
      const card = await asyncCreateFragmentCard({
        ...options,
      });
      return card;
    }
  ),
  fetchByBoard: createAsyncThunk(
    'fragmentCard/fetchByBoard',
    async (boardId: string) => {
      const cards = await asyncFetchFragmentCards(boardId);
      return cards;
    }
  ),
};

const slice = createSlice({
  name: 'fragmentCard',
  initialState: adapter.getInitialState<IFragmentCardExtraState>({
    createDialogVisible: false,
    createAsType: EFragmentType.NOTE,
    createForColumnId: undefined,
    currentId: undefined,
    loading: false,
  }),
  reducers: {
    showCreateDialog: {
      prepare(columnId: string, type: EFragmentType) {
        return { payload: { columnId, type } };
      },
      reducer(
        state,
        action: PayloadAction<{ columnId: string; type: EFragmentType }>
      ) {
        const { columnId, type } = action.payload;
        state.createForColumnId = columnId;
        state.createAsType = type;
        state.createDialogVisible = true;
      },
    },
    hideCreateDialog(state) {
      state.createDialogVisible = false;
    },
    setCreateForColumnId(state, action: PayloadAction<string | undefined>) {
      state.createForColumnId = action.payload;
    },
    setCurrentId(state, action: PayloadAction<string>) {
      state.currentId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunks.create.fulfilled, (state, action) => {
      const card = action.payload;
      adapter.addOne(state, card);
    });
    builder.addCase(thunks.fetchByBoard.fulfilled, (state, action) => {
      const cards = action.payload;
      adapter.upsertMany(state, cards);
      state.currentId = undefined;
    });
  },
});

export const fragmentCardActions = slice.actions;
export const fragmentCardReducer = slice.reducer;
export const fragmentCardSelectors = adapter.getSelectors();
export const fragmentCardThunks = thunks;
