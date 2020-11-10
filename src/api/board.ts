import {
  arrayUnion,
  auth,
  firestore,
  generateTimestamp,
  serverTimestamp,
  timestampToNumber,
} from './firebase';
import {
  EBoardPolicy,
  EBoardType,
  EFirestoreErrorMessage,
  IBoard,
  IFieldValueMap,
} from './types';
import { checkStringArrayEqual, generateUUID } from './utils';

export function boardComparatorByCheckedAt(a: IBoard, b: IBoard) {
  const checkedAtA = timestampToNumber(a.checkedAt);
  const checkedAtB = timestampToNumber(b.checkedAt);
  return checkedAtB - checkedAtA;
}

export function boardTimestampToNumber(board: IBoard) {
  board.checkedAt = timestampToNumber(board.checkedAt);
  board.createdAt = timestampToNumber(board.createdAt);
  board.updatedAt = timestampToNumber(board.updatedAt);
}

export async function asyncFetchAllBoards() {
  const userId = auth().currentUser?.uid;
  const querySnapshot = await firestore()
    .collection('boards')
    .where('userId', '==', userId)
    .get();
  const boards: IBoard[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const board = doc.data({ serverTimestamps: 'estimate' }) as IBoard;
      boardTimestampToNumber(board);
      boards.push(board);
    }
  });
  return boards;
}

export async function asyncFetchBoard(boardId: string, newCheckedAt = true) {
  const boardRef = firestore().collection('boards').doc(boardId);
  return firestore().runTransaction(async (transaction) => {
    const boardDoc = await transaction.get(boardRef);
    if (!boardDoc.exists) {
      throw new Error(EFirestoreErrorMessage.BOARD_NOT_EXISTED);
    }
    const board = boardDoc.data({ serverTimestamps: 'estimate' }) as IBoard;
    if (newCheckedAt) {
      transaction.update(boardRef, { checkedAt: serverTimestamp() });
    }
    boardTimestampToNumber(board);
    board.checkedAt = timestampToNumber(Date.now());
    return board;
  });
}

export async function asyncUpdateBoard(
  boardId: string,
  data: Partial<IBoard> | IFieldValueMap,
  newUpdatedAt = true
) {
  if (newUpdatedAt) {
    data.updatedAt = serverTimestamp();
  }
  await firestore().collection('boards').doc(boardId).update(data);
}

export async function asyncCheckBoard(boardId: string) {
  await asyncUpdateBoard(boardId, { checkedAt: serverTimestamp() });
}

export async function asyncPushBoardColumnOrder(
  boardId: string,
  columnId: string
) {
  await asyncUpdateBoard(boardId, {
    columnOrder: arrayUnion(columnId),
  });
}

export async function asyncAdjustTwoBoardColumnOrders(
  boardId1: string,
  columnOrder1: string[],
  boardId2: string,
  columnOrder2: string[]
) {
  const boardRef1 = firestore().collection('boards').doc(boardId1);
  const boardRef2 = firestore().collection('boards').doc(boardId2);
  return firestore().runTransaction(async (transaction) => {
    if (boardId1 === boardId2) {
      const boardDoc = await transaction.get(boardRef2);
      if (!boardDoc.exists) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_NOT_EXISTED);
      }
      const board = boardDoc.data({
        serverTimestamps: 'estimate',
      }) as IBoard;
      if (!checkStringArrayEqual(board.columnOrder, columnOrder2)) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_EXPIRED_DATA);
      }
      transaction.update(boardRef2, { columnOrder: columnOrder2 });
    } else {
      const [boardDoc1, boardDoc2] = await Promise.all([
        transaction.get(boardRef1),
        transaction.get(boardRef2),
      ]);
      const board1 = boardDoc1.data({
        serverTimestamps: 'estimate',
      }) as IBoard;
      const board2 = boardDoc2.data({
        serverTimestamps: 'estimate',
      }) as IBoard;
      if (
        !checkStringArrayEqual(
          board1.columnOrder.concat(board2.columnOrder),
          columnOrder1.concat(columnOrder2)
        )
      ) {
        throw new Error(EFirestoreErrorMessage.FRAGMENT_COLUMN_EXPIRED_DATA);
      }
      transaction.update(boardRef1, { columnOrder: columnOrder1 });
      transaction.update(boardRef2, { columnOrder: columnOrder2 });
    }
  });
}

export async function asyncCreateBoard(
  options: {
    title: string;
    type: EBoardType;
    policy: EBoardPolicy;
  } & Partial<IBoard>
) {
  const timestamp = serverTimestamp();
  const time0 = generateTimestamp(0, 0);
  const userId = auth().currentUser?.uid || '';
  const board: IBoard = {
    id: generateUUID(),
    userId,
    columnOrder: [],
    archived: false,
    checkedAt: time0,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...options,
  };
  await firestore().collection('boards').doc(board.id).set(board);
  boardTimestampToNumber(board);
  return board;
}
