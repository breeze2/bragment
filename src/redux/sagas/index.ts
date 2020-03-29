import { all, fork } from 'redux-saga/effects';
import { watchBoardSagas } from './board';
import { watchFragmentSagas } from './fragment';

export default function* () {
  yield all([fork(watchBoardSagas), fork(watchFragmentSagas)]);
}
