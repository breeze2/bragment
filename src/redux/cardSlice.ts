import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { asyncCreateCard, asyncFetchCards } from '../api/database/card';
import { ECardType, ICard } from '../api/types';
import { checkIfHttpUrl, checkIfSingleLine } from '../utils';
import { ICardExtraState } from './types';

const adapter = createEntityAdapter<ICard>();

const thunks = {
  simplyCreate: createAsyncThunk(
    'card/create',
    async (
      options: {
        boardId: string;
        columnId: string;
        content: string;
      },
      thunkAPI
    ) => {
      const { boardId, columnId, content } = options;
      const data: Parameters<typeof asyncCreateCard>[0] = { boardId, columnId };
      if (checkIfHttpUrl(options.content)) {
        data.link = content;
        data.type = ECardType.LINK;
      } else if (checkIfSingleLine(content)) {
        data.title = content;
        data.type = ECardType.NOTE;
      } else {
        data.content = content;
        data.type = ECardType.NOTE;
      }
      const card = await asyncCreateCard(data);
      return card;
    }
  ),
  create: createAsyncThunk(
    'card/create',
    async (options: Parameters<typeof asyncCreateCard>[0], thunkAPI) => {
      const card = await asyncCreateCard({
        ...options,
      });
      return card;
    }
  ),
  fetchByBoard: createAsyncThunk(
    'card/fetchByBoard',
    async (boardId: string) => {
      const cards = await asyncFetchCards(boardId);
      return cards;
    }
  ),
};

const slice = createSlice({
  name: 'card',
  initialState: adapter.getInitialState<ICardExtraState>({
    createDialogVisible: false,
    createAsType: ECardType.NOTE,
    createForColumnId: undefined,
    currentId: undefined,
    loading: false,
  }),
  reducers: {
    showCreateDialog: {
      prepare(columnId: string, type: ECardType) {
        return { payload: { columnId, type } };
      },
      reducer(
        state,
        action: PayloadAction<{ columnId: string; type: ECardType }>
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

export const cardActions = slice.actions;
export const cardReducer = slice.reducer;
export const cardSelectors = adapter.getSelectors();
export const cardThunks = thunks;
