import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { asyncSignIn, asyncSignOut, asyncSignUp } from '../api/auth';
import { AUTHENTICATING, IUserProfile, IUserState } from './types';

const initialState: IUserState = {
  currentId: AUTHENTICATING,
  currentProfile: undefined,
  signInDialogVisible: false,
};

const thunks = {
  create: createAsyncThunk(
    'user/create',
    async (args: { email: string; password: string }) => {
      const { email, password } = args;
      await asyncSignUp(email, password);
    }
  ),
  login: createAsyncThunk(
    'user/login',
    async (args: { email: string; password: string }) => {
      const { email, password } = args;
      await asyncSignIn(email, password);
    }
  ),
  logout: createAsyncThunk('user/logout', async () => {
    await asyncSignOut();
  }),
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: {
      prepare: (id?: string, profile?: IUserProfile) => {
        return { payload: { id, profile } };
      },
      reducer: (
        state,
        action: PayloadAction<{ id?: string; profile?: IUserProfile }>
      ) => {
        const { id, profile } = action.payload;
        state.currentId = id;
        state.currentProfile = profile;
        state.signInDialogVisible = false;
      },
    },
    setSignInDialogVisible(state, action: PayloadAction<boolean>) {
      state.signInDialogVisible = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(thunks.logout.fulfilled, (state) => {
      state.currentId = undefined;
      state.currentProfile = undefined;
    });
  },
});

export const userActions = slice.actions;
export const userReducer = slice.reducer;
export const userThunks = thunks;
