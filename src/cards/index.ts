import GistCard from './GistCard';
import LinkCard from './LinkCard';
import NoteCard from './NoteCard';
import { ICardComponent } from './types';

const cardMap = new Map<string, ICardComponent>();
const cardMessages: Record<string, Record<string, string>> = {};

export enum ECardComponentFilter {
  HAS_CREATE_FROM_ITEMS = 'HAS_CREATE_FROM_ITEMS',
  HAS_MESSAGES = 'HAS_MESSAGES',
}

export function getCardComponent(type: string) {
  return cardMap.get(type);
}

export function setCardComponent(type: string, component: ICardComponent) {
  const { messages } = component;
  if (messages) {
    for (const local in messages) {
      const localMessages = messages[local];
      if (!cardMessages[local]) {
        cardMessages[local] = {};
      }
      for (const field in localMessages) {
        cardMessages[local][`cards.${type}.${field}`] = localMessages[field];
      }
    }
  }
  return cardMap.set(type, component);
}

type ICardComponentArrayFilterPredicate = Parameters<
  Array<ICardComponent>['filter']
>[0];
export function getCardComponentTypes(
  filter: ECardComponentFilter | ICardComponentArrayFilterPredicate
) {
  const components = Array.from(cardMap.values());
  let predicate: ICardComponentArrayFilterPredicate;
  switch (filter) {
    case ECardComponentFilter.HAS_CREATE_FROM_ITEMS:
      predicate = (component) => component.CreateFormItems;
      break;
    case ECardComponentFilter.HAS_MESSAGES:
      predicate = (component) => component.messages;
      break;
    default:
      predicate = filter;
      break;
  }
  return components.filter(predicate).map((component) => component.type);
}

export function getAllCardComponentMessages() {
  return cardMessages;
}

setCardComponent(GistCard.type, GistCard);
setCardComponent(LinkCard.type, LinkCard);
setCardComponent(NoteCard.type, NoteCard);
