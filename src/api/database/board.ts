import {
  arrayUnion,
  firestore,
  serverTimestamp,
  timestampToNumber,
} from '../firebase';
import { IFieldValueMap } from '../firebase/types';
import {
  EBoardMemberRole,
  EBoardPolicy,
  EBoardType,
  EDatabaseErrorMessage,
  EDataTable,
  IBoard,
} from './types';
import {
  checkStringArrayEqual,
  documentTimestampToNumber,
  generateUUID,
  getCurrentUserId,
} from './utils';

export function boardComparatorByTimestamp(
  ts: 'createdAt' | 'updatedAt',
  a: IBoard,
  b: IBoard
) {
  const tsA = timestampToNumber(a[ts]);
  const tsB = timestampToNumber(b[ts]);
  return tsB - tsA;
}

export async function asyncFetchAllBoards() {
  const userId = getCurrentUserId();
  const boards: IBoard[] = [];
  const querySnapshot = await firestore()
    .collection(EDataTable.BOARD)
    .where(`memberShip.${userId}`, '!=', null)
    .get();
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const board = doc.data({ serverTimestamps: 'estimate' }) as IBoard;
      documentTimestampToNumber(board);
      boards.push(board);
    }
  });
  return boards;
}

export async function asyncFetchBoard(boardId: string) {
  const boardRef = firestore().collection(EDataTable.BOARD).doc(boardId);
  const boardDoc = await boardRef.get();
  if (!boardDoc.exists) {
    throw new Error(EDatabaseErrorMessage.BOARD_NOT_EXISTED);
  }
  const board = boardDoc.data({ serverTimestamps: 'estimate' }) as IBoard;
  documentTimestampToNumber(board);
  return board;
  // return firestore().runTransaction(async (transaction) => {
  //   const boardDoc = await transaction.get(boardRef);
  //   if (!boardDoc.exists) {
  //     throw new Error(EDatabaseErrorMessage.BOARD_NOT_EXISTED);
  //   }
  //   const board = boardDoc.data({ serverTimestamps: 'estimate' }) as IBoard;
  //   documentTimestampToNumber(board);
  //   return board;
  // });
}

export async function asyncUpdateBoard(
  boardId: string,
  data: Partial<IBoard> | IFieldValueMap,
  newUpdatedAt = true
) {
  if (newUpdatedAt) {
    data.updatedAt = serverTimestamp();
  }
  await firestore().collection(EDataTable.BOARD).doc(boardId).update(data);
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
  const boardRef1 = firestore().collection(EDataTable.BOARD).doc(boardId1);
  const boardRef2 = firestore().collection(EDataTable.BOARD).doc(boardId2);
  return firestore().runTransaction(async (transaction) => {
    if (boardId1 === boardId2) {
      const boardDoc = await transaction.get(boardRef2);
      if (!boardDoc.exists) {
        throw new Error(EDatabaseErrorMessage.COLUMN_NOT_EXISTED);
      }
      const board = boardDoc.data({
        serverTimestamps: 'estimate',
      }) as IBoard;
      if (!checkStringArrayEqual(board.columnOrder, columnOrder2)) {
        throw new Error(EDatabaseErrorMessage.COLUMN_EXPIRED_DATA);
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
        throw new Error(EDatabaseErrorMessage.COLUMN_EXPIRED_DATA);
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
  const userId = getCurrentUserId();
  const board: IBoard = {
    id: generateUUID(),
    userId,
    columnOrder: [],
    memberShip: { [userId]: EBoardMemberRole.OWNER },
    archived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...options,
  };
  await firestore().collection(EDataTable.BOARD).doc(board.id).set(board);
  documentTimestampToNumber(board);
  return board;
}
