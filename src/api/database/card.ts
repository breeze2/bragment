import { arrayUnion, firestore, serverTimestamp } from '../firebase';
import {
  EDatabaseErrorMessage,
  EDataTable,
  ICard,
  NOTE_CARD_TYPE,
} from '../types';
import {
  documentTimestampToNumber,
  generateUUID,
  getCurrentUserId,
} from '../utils';

export async function asyncFetchCards(boardId: string) {
  const querySnapshot = await firestore()
    .collection(EDataTable.CARD)
    .where('boardId', '==', boardId)
    .get();
  const cards: ICard[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const card = doc.data({ serverTimestamps: 'estimate' }) as ICard;
      documentTimestampToNumber(card);
      cards.push(card);
    }
  });
  return cards;
}

export async function asyncCreateCard(
  options: {
    boardId: string;
    columnId: string;
  } & Partial<ICard>
) {
  const userId = getCurrentUserId();
  const timestamp = serverTimestamp();
  const card: ICard = {
    id: generateUUID(),
    userId,
    tags: [],
    type: NOTE_CARD_TYPE,
    archived: false,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...options,
  };
  const columnRef = firestore().collection('columns').doc(card.columnId);
  const newCardRef = firestore().collection(EDataTable.CARD).doc(card.id);
  return firestore().runTransaction(async (transaction) => {
    const columnDoc = await transaction.get(columnRef);
    if (!columnDoc.exists) {
      throw new Error(EDatabaseErrorMessage.COLUMN_NOT_EXISTED);
    }
    transaction.set(newCardRef, card);
    transaction.update(columnRef, { cardOrder: arrayUnion(card.id) });
    documentTimestampToNumber(card);
    return card;
  });
}
