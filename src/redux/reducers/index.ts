import { combineReducers } from 'redux';
import { IReduxAction, IReduxState } from '../types';
import board from './board';
import common from './common';
import fragment from './fragment';

export default combineReducers<IReduxState, IReduxAction>({
  board,
  common,
  fragment,
});
