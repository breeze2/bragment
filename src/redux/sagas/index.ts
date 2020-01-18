import { all, fork } from 'redux-saga/effects';
import { watchBoardSagas } from './board';

export default function*() {
  yield all([fork(watchBoardSagas)]);
}
