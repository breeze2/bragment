import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELanguage } from '../i18n/types';
import { getLocalLanguage } from '../utils';
import { EAppTheme, ICommonState } from './types';

const defaultLanguage = getLocalLanguage();
const defaultTheme = EAppTheme.LIGHT;

const initialState: ICommonState = {
  language: defaultLanguage as ELanguage,
  onLine: navigator.onLine,
  theme: defaultTheme,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<ELanguage>) {
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
