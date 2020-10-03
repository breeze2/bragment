import { IPartial } from '../types';
import {
  arrayUnion,
  firestore,
  getTimestamp,
  serverTimestamp,
} from './firebase';
import { EBoardType, IBoard, IFieldValueMap } from './types';
import { generateUUID } from './utils';

export function boardComparatorByCheckedAt(a: IBoard, b: IBoard) {
  if (a.lastCheckedAt && b.lastCheckedAt) {
    return b.lastCheckedAt - a.lastCheckedAt;
  }
  if (a.lastCheckedAt) {
    return -1;
  }
  if (b.lastCheckedAt) {
    return 1;
  }
  if ('seconds' in a.checkedAt && 'seconds' in b.checkedAt) {
    return b.checkedAt.seconds - a.checkedAt.seconds;
  }
  return 0;
}

export async function asyncSelectPersonalBoards(userId: string) {
  const querySnapshot = await firestore()
    .collection('boards')
    .where('type', '==', EBoardType.PERSONAL)
    .where('userId', '==', userId)
    .get();
  const boards: IBoard[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const board = doc.data({ serverTimestamps: 'estimate' }) as IBoard;
      boards.push(board);
    }
  });
  return boards;
}

export async function asyncFetchBoard(boardId: string) {
  const doc = await firestore().collection('boards').doc(boardId).get();
  const board = doc.data({ serverTimestamps: 'estimate' }) as IBoard;
  return board;
}

export async function asyncUpdateBoard(
  boardId: string,
  data: IPartial<IBoard> | IFieldValueMap
) {
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

export async function asyncInsertBoard(
  board: IPartial<IBoard>
): Promise<IBoard | undefined> {
  if (!board.title || !board.userId || !board.type || !board.policy) {
    return;
  }
  const timestamp = serverTimestamp();
  const time0 = getTimestamp(0, 0);
  const data: IBoard = {
    id: generateUUID(),
    title: board.title,
    userId: board.userId,
    color: board.color,
    image: board.image,
    columnOrder: board.columnOrder || [],
    archived: board.archived || false,
    type: board.type,
    policy: board.policy,
    checkedAt: time0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  if (board.groupId) {
    data.groupId = board.groupId;
  }
  await firestore().collection('boards').doc(data.id).set(data);
  return data;
}
