import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EAppTheme, ICommonState } from './types';

const LANGUAGE = 'LANGUAGE';
const defaultLanguage =
  window.localStorage.getItem(LANGUAGE) || navigator.language;
const defaultTheme = EAppTheme.LIGHT;

const initialState: ICommonState = {
  language: defaultLanguage,
  onLine: navigator.onLine,
  theme: defaultTheme,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setOnLine(state, action: PayloadAction<boolean>) {
      state.onLine = action.payload;
    },
    setTheme(state, action: PayloadAction<EAppTheme>) {
      state.theme = action.payload;
    },
  },
});

export const commonActions = slice.actions;
export const commonReducer = slice.reducer;
