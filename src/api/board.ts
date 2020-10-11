import {
  arrayUnion,
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

export async function asyncFetchAllBoards(userId: string) {
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

export async function asyncAdjustBoardColumnOrder(
  boardId: string,
  columnOrder: string[]
) {
  const boardRef = firestore().collection('boards').doc(boardId);
  return firestore().runTransaction(async (transaction) => {
    const boardDoc = await transaction.get(boardRef);
    if (!boardDoc.exists) {
      throw new Error(EFirestoreErrorMessage.BOARD_NOT_EXISTED);
    }
    const board = boardDoc.data({ serverTimestamps: 'estimate' }) as IBoard;
    if (!checkStringArrayEqual(board.columnOrder, columnOrder)) {
      throw new Error(EFirestoreErrorMessage.BOARD_EXPIRED_DATA);
    }
    transaction.update(boardRef, { columnOrder });
  });
}

export async function asyncInsertBoard(
  options: {
    title: string;
    userId: string;
    type: EBoardType;
    policy: EBoardPolicy;
  } & Partial<IBoard>
) {
  const timestamp = serverTimestamp();
  const time0 = generateTimestamp(0, 0);
  const board: IBoard = {
    id: generateUUID(),
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
