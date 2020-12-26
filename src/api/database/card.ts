import { arrayUnion, auth, firestore } from '../firebase';
import { ECardType, EDatabaseErrorMessage, EDataTable, ICard } from '../types';
import { generateUUID } from '../utils';

export async function asyncFetchCards(boardId: string) {
  const querySnapshot = await firestore()
    .collection(EDataTable.CARD)
    .where('boardId', '==', boardId)
    .get();
  const cards: ICard[] = [];
  querySnapshot.forEach((doc) => {
    if (doc.exists) {
      const card = doc.data({ serverTimestamps: 'estimate' }) as ICard;
      cards.push(card);
    }
  });
  return cards;
}

export async function asyncCreateCard(
  options: {
    boardId: string;
    columnId: string;
    title: string;
  } & Partial<ICard>
) {
  const userId = auth().currentUser?.uid || '';
  const data: ICard = {
    id: generateUUID(),
    userId,
    tags: [],
    type: ECardType.NOTE,
    archived: false,
    ...options,
  };
  const columnRef = firestore().collection('columns').doc(data.columnId);
  const newCardRef = firestore().collection(EDataTable.CARD).doc(data.id);
  return firestore().runTransaction(async (transaction) => {
    const columnDoc = await transaction.get(columnRef);
    if (!columnDoc.exists) {
      throw new Error(EDatabaseErrorMessage.COLUMN_NOT_EXISTED);
    }
    transaction.set(newCardRef, data);
    transaction.update(columnRef, { cardOrder: arrayUnion(data.id) });
    return data;
  });
}
