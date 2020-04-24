import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { IUpdateDataGroup } from '../types';
import config from './config';

export let firebaseApp: firebase.app.App | undefined;

export function initFirebase() {
  firebaseApp = firebase.initializeApp(config);

  firebase
    .auth(firebaseApp)
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  firebase.firestore(firebaseApp).settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
  });

  firebase
    .firestore(firebaseApp)
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
  return firebase.firestore(firebaseApp);
}

export function auth() {
  return firebase.auth(firebaseApp);
}

export function serverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

export function arrayUnion(item: string) {
  return firebase.firestore.FieldValue.arrayUnion(item);
}

export function getTimestamp(seconds: number, nanoseconds: number) {
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
