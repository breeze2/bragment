import { arrayUnion, batchUpdate, firestore } from './firebase';
import {
  EFirestoreErrorMessage,
  EFragmentType,
  IFieldValueMap,
  IFragmentCard,
  IFragmentColumn,
  IUpdateDataGroup,
} from './types';
import { checkStringArrayEqual, generateUUID } from './utils';

export async function asyncFetchFragmentCards(boardId: string) {
  const querySnapshot = await firestore()
    .collection('cards')
    .where('boardId', '==', boardId)
    .get();
  const cards: IFragmentCard[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const card = doc.data({ serverTimestamps: 'estimate' }) as IFragmentCard;
      cards.push(card);
    }
  });
  return cards;
}

export async function asyncFetchFragmentColumns(boardId: string) {
  const querySnapshot = await firestore()
    .collection('columns')
    .where('boardId', '==', boardId)
    .get();
  const columns: IFragmentColumn[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const column = doc.data({
        serverTimestamps: 'estimate',
      }) as IFragmentColumn;
      columns.push(column);
    }
  });
  return columns;
}

export async function asyncInsertFragmentColumn(
  options: { boardId: string; userId: string; title: string } & Partial<
    IFragmentColumn
  >
) {
  const data: IFragmentColumn = {
    id: generateUUID(),
    cardOrder: [],
    archived: false,
    ...options,
  };
  const boardRef = firestore().collection('boards').doc(data.boardId);
  const newColumnRef = firestore().collection('columns').doc(data.id);
  return firestore().runTransaction(async (transaction) => {
    const boardDoc = await transaction.get(boardRef);
    if (!boardDoc.exists) {
      throw new Error(EFirestoreErrorMessage.BOARD_NOT_EXISTED);
    }
    transaction.set(newColumnRef, data);
    transaction.update(boardRef, { columnOrder: arrayUnion(data.id) });
    return data;
  });
}

export async function asyncInsertFragmentCard(
  options: {
    userId: string;
    boardId: string;
    columnId: string;
    title: string;
  } & Partial<IFragmentCard>
) {
  const data: IFragmentCard = {
    id: generateUUID(),
    tags: [],
    type: EFragmentType.NOTE,
    archived: false,
    ...options,
  };
  const columnRef = firestore().collection('column').doc(data.columnId);
  const newCardRef = firestore().collection('cards').doc(data.id);
  return firestore().runTransaction(async (transaction) => {
    const columnDoc = await transaction.get(columnRef);
    if (!columnDoc.exists) {
      throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_NOT_EXISTED);
    }
    transaction.set(newCardRef, data);
    transaction.update(columnRef, { cardOrder: arrayUnion(data.id) });
    return data;
  });
}

export async function asyncUpdateFragmentColumn(
  columnId: string,
  data: Partial<IFragmentColumn> | IFieldValueMap
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

export async function asyncAdjustTowFragmentColumnCardOrders(
  id1: string,
  cardOrder1: string[],
  id2: string,
  cardOrder2: string[]
) {
  const columnRef1 = firestore().collection('columns').doc(id1);
  const columnRef2 = firestore().collection('columns').doc(id2);
  return firestore().runTransaction(async (transaction) => {
    if (id1 === id2) {
      const columnDoc = await transaction.get(columnRef2);
      if (!columnDoc.exists) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_NOT_EXISTED);
      }
      const column = columnDoc.data({
        serverTimestamps: 'estimate',
      }) as IFragmentColumn;
      if (!checkStringArrayEqual(column.cardOrder, cardOrder2)) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_EXPIRED_DATA);
      }
      transaction.update(columnRef2, { cardOrder: cardOrder2 });
    } else {
      const [columnDoc1, columnDoc2] = await Promise.all([
        transaction.get(columnRef1),
        transaction.get(columnRef2),
      ]);
      const column1 = columnDoc1.data({
        serverTimestamps: 'estimate',
      }) as IFragmentColumn;
      const column2 = columnDoc2.data({
        serverTimestamps: 'estimate',
      }) as IFragmentColumn;
      if (
        !checkStringArrayEqual(
          column1.cardOrder.concat(column2.cardOrder),
          cardOrder1.concat(cardOrder2)
        )
      ) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_EXPIRED_DATA);
      }
      transaction.update(columnRef1, { cardOrder: cardOrder1 });
      transaction.update(columnRef2, { cardOrder: cardOrder2 });
    }
  });
}

export async function asyncBatchUpdateFragmentColumns(
  group: IUpdateDataGroup<IFragmentColumn>
) {
  await batchUpdate('columns', group);
}
