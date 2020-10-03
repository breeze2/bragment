import { IPartial } from '../types';
import { arrayUnion, batchUpdate, firestore } from './firebase';
import {
  EFragmentType,
  IFieldValueMap,
  IFragmentCard,
  IFragmentColumn,
  IUpdateDataGroup,
} from './types';
import { generateUUID } from './utils';

export async function asyncFetchFragmentCardMap(boardId: string) {
  const querySnapshot = await firestore()
    .collection('cards')
    .where('boardId', '==', boardId)
    .get();
  const cardMap = new Map<string, IFragmentCard>();
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const card = doc.data({ serverTimestamps: 'estimate' }) as IFragmentCard;
      cardMap.set(doc.id, card);
    }
  });
  return cardMap;
}

export async function asyncFetchFragmentColumnMap(boardId: string) {
  const querySnapshot = await firestore()
    .collection('columns')
    .where('boardId', '==', boardId)
    .get();
  const columnMap = new Map<string, IFragmentColumn>();
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const column = doc.data({
        serverTimestamps: 'estimate',
      }) as IFragmentColumn;
      columnMap.set(doc.id, column);
    }
  });
  return columnMap;
}

export async function asyncInsertFragmentColumn(
  boardId: string,
  title: string
): Promise<IFragmentColumn | undefined> {
  const data: IFragmentColumn = {
    id: generateUUID(),
    boardId,
    title,
    cardOrder: [],
    archived: false,
  };
  await firestore().collection('columns').doc(data.id).set(data);
  return data;
}

export async function asyncInsertFragmentCard(
  boardId: string,
  columnId: string,
  title: string,
  others?: IPartial<IFragmentCard>
) {
  const data: IFragmentCard = {
    id: generateUUID(),
    boardId,
    columnId,
    title,
    tags: [],
    type: EFragmentType.NOTE,
    archived: false,
    ...others,
  };
  await firestore().collection('cards').doc(data.id).set(data);
  return data;
}

export async function asyncUpdateFragmentColumn(
  columnId: string,
  data: IPartial<IFragmentColumn> | IFieldValueMap
) {
  await firestore().collection('columns').doc(columnId).update(data);
}

export async function asyncPushFragmentColumnCardOrder(
  columnId: string,
  cardId: string
) {
  await asyncUpdateFragmentColumn(columnId, {
    cardOrder: arrayUnion(cardId),
  });
}

export async function asyncBatchUpdateFragmentColumns(
  group: IUpdateDataGroup<IFragmentColumn>
) {
  await batchUpdate('columns', group);
}
