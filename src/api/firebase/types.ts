import type firebase from 'firebase';

export type ITimeStamp =
  | number
  | firebase.firestore.Timestamp
  | firebase.firestore.FieldValue;

export type IFieldValueMap = {
  [key: string]: firebase.firestore.FieldValue;
};

export type IUpdateDataGroup<T> = {
  id: string;
  data: Partial<T> | IFieldValueMap;
}[];
