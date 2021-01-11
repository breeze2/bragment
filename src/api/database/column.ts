import { arrayUnion, firestore, serverTimestamp } from '../firebase';
import {
  EDatabaseErrorMessage,
  EDataTable,
  IColumn,
  IFieldValueMap,
} from '../types';
import {
  checkStringArrayEqual,
  documentTimestampToNumber,
  generateUUID,
  getCurrentUserId,
} from '../utils';

export async function asyncFetchColumns(boardId: string) {
  const querySnapshot = await firestore()
    .collection(EDataTable.COLUMN)
    .where('boardId', '==', boardId)
    .get();
  const columns: IColumn[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const column = doc.data({
        serverTimestamps: 'estimate',
      }) as IColumn;
      documentTimestampToNumber(column);
      columns.push(column);
    }
  });
  return columns;
}

export async function asyncCreateColumn(
  options: { boardId: string; title: string } & Partial<IColumn>
) {
  const userId = getCurrentUserId();
  const timestamp = serverTimestamp();
  const column: IColumn = {
    id: generateUUID(),
    userId,
    cardOrder: [],
    archived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...options,
  };
  const boardRef = firestore().collection('boards').doc(column.boardId);
  const newColumnRef = firestore().collection(EDataTable.COLUMN).doc(column.id);
  return firestore().runTransaction(async (transaction) => {
    const boardDoc = await transaction.get(boardRef);
    if (!boardDoc.exists) {
      throw new Error(EDatabaseErrorMessage.BOARD_NOT_EXISTED);
    }
    transaction.set(newColumnRef, column);
    transaction.update(boardRef, { columnOrder: arrayUnion(column.id) });
    documentTimestampToNumber(column);
    return column;
  });
}

export async function asyncUpdateColumn(
  columnId: string,
  data: Partial<IColumn> | IFieldValueMap
) {
  await firestore().collection(EDataTable.COLUMN).doc(columnId).update(data);
}

export async function asyncPushColumnCardOrder(
  columnId: string,
  cardId: string
) {
  await asyncUpdateColumn(columnId, {
    cardOrder: arrayUnion(cardId),
  });
}

export async function asyncAdjustTowColumnCardOrders(
  columnId1: string,
  cardOrder1: string[],
  columnId2: string,
  cardOrder2: string[]
) {
  const columnRef1 = firestore().collection(EDataTable.COLUMN).doc(columnId1);
  const columnRef2 = firestore().collection(EDataTable.COLUMN).doc(columnId2);
  return firestore().runTransaction(async (transaction) => {
    if (columnId1 === columnId2) {
      const columnDoc = await transaction.get(columnRef2);
      if (!columnDoc.exists) {
        throw new Error(EDatabaseErrorMessage.COLUMN_NOT_EXISTED);
      }
      const column = columnDoc.data({
        serverTimestamps: 'estimate',
      }) as IColumn;
      if (!checkStringArrayEqual(column.cardOrder, cardOrder2)) {
        throw new Error(EDatabaseErrorMessage.COLUMN_EXPIRED_DATA);
      }
      transaction.update(columnRef2, { cardOrder: cardOrder2 });
    } else {
      const [columnDoc1, columnDoc2] = await Promise.all([
        transaction.get(columnRef1),
        transaction.get(columnRef2),
      ]);
      const column1 = columnDoc1.data({
        serverTimestamps: 'estimate',
      }) as IColumn;
      const column2 = columnDoc2.data({
        serverTimestamps: 'estimate',
      }) as IColumn;
      if (
        !checkStringArrayEqual(
          column1.cardOrder.concat(column2.cardOrder),
          cardOrder1.concat(cardOrder2)
        )
      ) {
        throw new Error(EDatabaseErrorMessage.COLUMN_EXPIRED_DATA);
      }
      transaction.update(columnRef1, { cardOrder: cardOrder1 });
      transaction.update(columnRef2, { cardOrder: cardOrder2 });
    }
  });
}
