import { combineReducers } from 'redux';
import { IReduxAction, IReduxState } from '../types';
import common from './common';

export default combineReducers<IReduxState, IReduxAction>({
  common,
});
