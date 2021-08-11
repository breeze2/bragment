import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from './config';
import { IUpdateDataGroup } from './types';

export const firebaseApp = firebase.initializeApp(config);

export function initFirebase() {
  firebaseApp.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  firebaseApp.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  });

  firebaseApp
    .firestore()
    .enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // NOTE: has been enabled in another tab
        // do nothing
      } else if (err.code === 'unimplemented') {
        // NOTE: browser does not support
        // do nothing
      }
    });
}

export function firestore() {
  return firebaseApp.firestore();
}

export function auth() {
  return firebaseApp.auth();
}

export function serverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

export function timestampToNumber(
  ts: number | firebase.firestore.Timestamp | firebase.firestore.FieldValue
) {
  if (typeof ts === 'number') {
    return ts;
  }
  if (ts instanceof firebase.firestore.Timestamp) {
    return ts.toMillis();
  }
  return 0;
}

export function arrayUnion(item: string) {
  return firebase.firestore.FieldValue.arrayUnion(item);
}

export function generateTimestamp(seconds: number, nanoseconds: number) {
  return new firebase.firestore.Timestamp(seconds, nanoseconds);
}

export function batchUpdate<T>(pathname: string, group: IUpdateDataGroup<T>) {
  const batch = firestore().batch();
  group.forEach((el) => {
    const ref = firestore().collection(pathname).doc(el.id);
    batch.update(ref, el.data);
  });
  return batch.commit();
}
