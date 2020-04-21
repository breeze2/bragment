import { EAppTheme, IReduxAction } from '../types';

export const SET_APP_LANGUAGE = 'SET_APP_LANGUAGE';
export const SET_APP_ON_LINE = 'SET_APP_ON_LINE';
export const SET_APP_THEME = 'SET_APP_THEME';
export const SET_SIGN_IN_DIALOG_VISIBLE = 'SET_SIGN_IN_DIALOG_VISIBLE';

export type ISetAppLanguageAction = IReduxAction<
  typeof SET_APP_LANGUAGE,
  { language: string }
>;

export type ISetAppOnLineAction = IReduxAction<
  typeof SET_APP_ON_LINE,
  { onLine: boolean }
>;

export type ISetAppThemeAction = IReduxAction<
  typeof SET_APP_THEME,
  { theme: EAppTheme }
>;

export type ISetSignInDialogVisibleAction = IReduxAction<
  typeof SET_SIGN_IN_DIALOG_VISIBLE,
  { visible: boolean }
>;

export type ICommonAction =
  | ISetAppLanguageAction
  | ISetAppOnLineAction
  | ISetAppThemeAction
  | ISetSignInDialogVisibleAction;

export const setAppLanguage = (language: string): ISetAppLanguageAction => ({
  payload: { language },
  type: SET_APP_LANGUAGE,
});

export const setAppOnLine = (onLine: boolean): ISetAppOnLineAction => ({
  payload: { onLine },
  type: SET_APP_ON_LINE,
});

export const setAppTheme = (theme: EAppTheme): ISetAppThemeAction => ({
  payload: { theme },
  type: SET_APP_THEME,
});

export const setSignInDialogVisible = (
  visible: boolean
): ISetSignInDialogVisibleAction => ({
  payload: { visible },
  type: SET_SIGN_IN_DIALOG_VISIBLE,
});
