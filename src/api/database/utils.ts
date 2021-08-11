import { v4 as UUID4 } from 'uuid';
import { auth, timestampToNumber } from '../firebase';
import { EDatabaseErrorMessage, IBaseDocument } from './types';

export function generateUUID() {
  return UUID4();
}

export function getCurrentUserId() {
  const uid = auth().currentUser?.uid;
  if (!uid) {
    throw new Error(EDatabaseErrorMessage.UNAUTHORIZED);
  }
  return uid;
}

export function documentTimestampToNumber(document: IBaseDocument) {
  document.createdAt = timestampToNumber(document.createdAt);
  document.deletedAt =
    document.deletedAt && timestampToNumber(document.deletedAt);
  document.updatedAt = timestampToNumber(document.updatedAt);
}

export function checkStringArrayEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }
  const listA = a.concat().sort();
  const listB = b.concat().sort();
  for (let i = 0; i < listA.length; i++) {
    if (listA[i] !== listB[i]) return false;
  }
  return true;
}
