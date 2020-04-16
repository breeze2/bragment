import Immutable from 'immutable';
import {
  ICommonAction,
  SET_APP_LANGUAGE,
  SET_APP_ON_LINE,
  SET_APP_THEME,
} from '../actions';
import { EAppTheme, ICommonState } from '../types';

const LANGUAGE = 'LANGUAGE';
const defaultLanguage =
  window.localStorage.getItem(LANGUAGE) || navigator.language;
const defaultTheme = EAppTheme.LIGHT;

const initialCommonState = Immutable.Record<ICommonState>({
  language: defaultLanguage,
  onLine: navigator.onLine,
  theme: defaultTheme,
})();

const commonReducer = (state = initialCommonState, action: ICommonAction) => {
  switch (action.type) {
    case SET_APP_LANGUAGE:
      return state.set('language', action.payload.language);
    case SET_APP_ON_LINE:
      return state.set('onLine', action.payload.onLine);
    case SET_APP_THEME:
      return state.set('theme', action.payload.theme);
    default:
      return state;
  }
};

export default commonReducer;
