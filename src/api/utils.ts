import { v4 as UUID4 } from 'uuid';

export function generateUUID() {
  return UUID4();
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
